"""
Django settings for setup project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta  # <-- IMPORTANTE: Necessário para definir o tempo do Token JWT

# 1. Carrega as variáveis do arquivo .env antes de tudo
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Puxa a chave secreta com segurança
SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = True

# 3. Libera acesso local para testes
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 4. Ferramentas e Apps do FlowTrade
    'rest_framework',
    'rest_framework_simplejwt',  # <-- Registrando o JWT
    'corsheaders',
    'estoque',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # 5. Middleware do CORS precisa ficar no topo
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'setup.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'setup.wsgi.application'

# 6. Conexão com o Supabase (PostgreSQL) usando o .env
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# 7. Tradução e Fuso Horário para o Brasil
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 8. Permite que o frontend (Next.js) comunique com esta API sem bloqueios
CORS_ALLOW_ALL_ORIGINS = True

# ---------------------------------------------------------
# 9. CONFIGURAÇÕES DE SEGURANÇA (JWT E REST FRAMEWORK)
# ---------------------------------------------------------

REST_FRAMEWORK = {
    # Define que a autenticação padrão será via Token JWT
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Exige que o usuário esteja autenticado para acessar qualquer endpoint da API
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), # O token dura 1 dia antes de pedir login de novo
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}