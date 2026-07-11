from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Categoria, Produto, Loja, Funcionario

class LojaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loja
        fields = '__all__'

class FuncionarioSerializer(serializers.ModelSerializer):
    # Puxamos o e-mail direto da tabela de Usuário do Django para mostrar no Front-end
    email = serializers.CharField(source='usuario.email', read_only=True)
    nome_usuario = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Funcionario
        fields = ['id', 'loja', 'cargo', 'criado_em', 'email', 'nome_usuario']

class CategoriaSerializer(serializers.ModelSerializer):
    # A loja vem do usuário logado (viewset perform_create). Evita 400 por payload.
    loja = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Categoria
        fields = ['id', 'loja', 'nome']

    def validate(self, attrs):
        # Não deixe o client enviar/alterar a loja
        attrs.pop('loja', None)
        return attrs



class ProdutoSerializer(serializers.ModelSerializer):
    # Isso aqui manda o nome da categoria pro Next.js, em vez de só mandar o ID
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)

    # A loja vem do usuário logado (viewset perform_create). Evita 400 por payload.
    loja = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Produto
        fields = [
            'id',
            'loja',
            'categoria',
            'nome',
            'preco',
            'quantidade',

            'codigo_barras',
            'criado_em',
            'atualizado_em',
            'categoria_nome',
        ]

    def validate_categoria(self, value):
        # Categoria é obrigatória.
        if value is None:
            raise serializers.ValidationError('Categoria é obrigatória.')
        return value

    def validate(self, attrs):
        # DRF chama `validate_categoria` junto, mas garantimos aqui também.
        if 'categoria' not in attrs or attrs.get('categoria') is None:
            raise serializers.ValidationError({'categoria': ['Categoria é obrigatória.']})
        return attrs






