from django.db import models
from django.contrib.auth.models import User
import uuid

class Loja(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    dono = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    nome = models.CharField(max_length=255)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Categoria(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='categorias')
    nome = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nome} - {self.loja.nome}"

class Produto(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='produtos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='produtos')
    nome = models.CharField(max_length=255)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.IntegerField(null=True, blank=True)
    codigo_barras = models.CharField(max_length=50, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.nome

# --- NOVA TABELA: EQUIPE DA LOJA ---
class Funcionario(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='funcionario')
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, related_name='funcionarios')
    cargo = models.CharField(max_length=50, default='Caixa') 
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} ({self.cargo}) - {self.loja.nome}"