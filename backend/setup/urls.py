from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from estoque.views import CategoriaViewSet, ProdutoViewSet, registrar_loja, cadastrar_funcionario, atualizar_precos_massa, atualizar_quantidades_massa



from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
# Adicionamos o "basename" aqui para ensinar o Django a nomear as rotas
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'produtos', ProdutoViewSet, basename='produto')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Rotas de Autenticação e Cadastro
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/registrar/', registrar_loja, name='registrar_loja'),
    path('api/equipe/novo/', cadastrar_funcionario, name='cadastrar_funcionario'),
    path('api/produtos/precos/massa/', atualizar_precos_massa, name='atualizar_precos_massa'),
    path('api/produtos/quantidades/massa/', atualizar_quantidades_massa, name='atualizar_quantidades_massa'),
]
