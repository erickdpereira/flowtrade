from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Categoria, Produto, Loja, Funcionario
from .serializers import CategoriaSerializer, ProdutoSerializer

# --- FUNÇÃO AJUDANTE PARA DESCOBRIR A LOJA DO LOGIN ---
def get_loja_usuario(user):
    # 1) Dono
    loja_dono = getattr(user, 'loja_set', None)
    if loja_dono is not None:
        dono = loja_dono.first()
        if dono:
            return dono

    # 2) Funcionário
    funcionario = getattr(user, 'funcionario', None)
    if funcionario:
        return funcionario.loja

    return None



# --- CRUD DE CATEGORIAS ---
class CategoriaViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        # Filtra categorias usando a função ajudante (funciona para dono e funcionário)
        loja = get_loja_usuario(self.request.user)
        if loja:
            return Categoria.objects.filter(loja=loja)
        return Categoria.objects.none()

    def perform_create(self, serializer):
        # Vincula a categoria à loja correta
        loja = get_loja_usuario(self.request.user)
        serializer.save(loja=loja)

# --- CRUD DE PRODUTOS ---
class ProdutoViewSet(viewsets.ModelViewSet):
    serializer_class = ProdutoSerializer

    def get_queryset(self):
        loja = get_loja_usuario(self.request.user)
        if loja:
            return Produto.objects.filter(loja=loja)
        return Produto.objects.none()

    def perform_create(self, serializer):
        loja = get_loja_usuario(self.request.user)
        if not loja:
            return Response({'erro': 'Loja não encontrada para o usuário logado.'}, status=404)

        categoria = serializer.validated_data.get('categoria')
        if categoria is None:
            return Response({'erro': 'Categoria é obrigatória.'}, status=400)
        if categoria.loja_id != loja.id:
            return Response({'erro': 'Categoria não pertence à sua loja.'}, status=400)

        # quantidade é opcional (null/blank permitido)
        serializer.save(loja=loja)






# --- PORTA DOS FUNDOS: CADASTRO DE LOJAS (PÚBLICO) ---
@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_loja(request):
    email = request.data.get('email')
    password = request.data.get('password')
    nome_loja = request.data.get('nome_loja')

    if User.objects.filter(username=email).exists():
        return Response({'erro': 'Este e-mail já está cadastrado.'}, status=400)

    try:
        # Cria o usuário e a loja automaticamente
        user = User.objects.create_user(username=email, email=email, password=password)
        Loja.objects.create(nome=nome_loja, dono=user)
        return Response({'sucesso': 'Conta e Loja criadas com sucesso!'}, status=201)
    except Exception as e:
        return Response({'erro': str(e)}, status=500)


# --- NOVA ROTA: ATUALIZAR PREÇOS EM MASSA ---
from django.shortcuts import get_object_or_404


@api_view(['PATCH'])
def atualizar_precos_massa(request):

    # Pega a loja do usuário logado
    loja = get_loja_usuario(request.user)

    if not loja:
        return Response({'erro': 'Loja não encontrada.'}, status=404)

    alteracoes = request.data.get('alteracoes')
    if not isinstance(alteracoes, list) or len(alteracoes) == 0:
        return Response({'erro': 'alteracoes é obrigatório (lista).'}, status=400)

    # Apenas valores válidos
    ids = []
    for a in alteracoes:
        if not isinstance(a, dict):
            continue
        pid = a.get('id')
        preco = a.get('preco')
        if pid and preco is not None:
            ids.append((pid, preco))

    if not ids:
        return Response({'erro': 'Nenhuma alteração válida.'}, status=400)

    # Atualiza somente produtos da loja logada
    produtos = Produto.objects.filter(loja=loja)
    produtos_map = {str(p.id): p for p in produtos}

    updated = 0
    for pid, preco in ids:
        produto = produtos_map.get(str(pid))
        if not produto:
            continue
        produto.preco = preco
        produto.save(update_fields=['preco', 'atualizado_em'])
        updated += 1

    return Response({'sucesso': f'{updated} produtos atualizados.'}, status=200)


# --- NOVA ROTA: ATUALIZAR QUANTIDADES EM MASSA ---
@api_view(['PATCH'])
def atualizar_quantidades_massa(request):
    loja = get_loja_usuario(request.user)
    if not loja:
        return Response({'erro': 'Loja não encontrada.'}, status=404)

    alteracoes = request.data.get('alteracoes')
    if not isinstance(alteracoes, list) or len(alteracoes) == 0:
        return Response({'erro': 'alteracoes é obrigatório (lista).'}, status=400)

    ids = []
    for a in alteracoes:
        if not isinstance(a, dict):
            continue
        pid = a.get('id')
        quantidade = a.get('quantidade')
        if pid is None:
            continue
        if quantidade is None or quantidade == '':
            ids.append((pid, None))
            continue
        try:
            ids.append((pid, int(quantidade)))
        except Exception:
            continue

    if not ids:
        return Response({'erro': 'Nenhuma alteração válida.'}, status=400)

    produtos = Produto.objects.filter(loja=loja)
    produtos_map = {str(p.id): p for p in produtos}

    updated = 0
    for pid, quantidade in ids:
        produto = produtos_map.get(str(pid))
        if not produto:
            continue
        produto.quantidade = quantidade
        produto.save(update_fields=['quantidade', 'atualizado_em'])
        updated += 1

    return Response({'sucesso': f'{updated} produtos atualizados.'}, status=200)


# --- NOVA ROTA: CADASTRAR EQUIPE DA LOJA ---

@api_view(['POST'])
@permission_classes([None])
def cadastrar_funcionario(request):



    # Pega a loja do usuário logado
    loja = get_loja_usuario(request.user)

    if not loja:
        return Response({'erro': 'Loja não encontrada.'}, status=404)

    # Regra de Ouro: Apenas o dono pode criar acessos para a equipe.
    # (Se o usuário tiver "funcionario" ligado, então ele é funcionário.
    #  Logo, não pode cadastrar outros.)
    if hasattr(request.user, 'funcionario'):
        return Response(
            {'erro': 'Apenas o dono da loja pode criar acessos para a equipe.'},
            status=403,
        )

    email = request.data.get('email')
    password = request.data.get('password')
    cargo = request.data.get('cargo', 'Caixa')  # default: Caixa

    if not email or not password:
        return Response({'erro': 'email e password são obrigatórios.'}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({'erro': 'Este e-mail já está em uso por outro usuário.'}, status=400)

    try:
        # 1. Cria o login do funcionário
        user = User.objects.create_user(username=email, email=email, password=password)

        # 2. Vincula o usuário à loja do dono
        Funcionario.objects.create(usuario=user, loja=loja, cargo=cargo)

        return Response(
            {'sucesso': f'{cargo} cadastrado com sucesso e pronto para acessar o sistema!'},
            status=201,
        )
    except Exception as e:
        return Response({'erro': str(e)}, status=500)

