'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- 1. LOGIN ---
export async function realizarLogin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Bate no Django para validar
  const response = await fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    // Salva o Token em um Cookie HttpOnly (invisível para hackers/scripts)
    const cookieStore = await cookies();
    cookieStore.set('flowtrade_token', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // Expira em 1 dia
    });

    // Redireciona para o painel de forma segura
    redirect('/home');
  }

  return { erro: 'Usuário ou senha incorretos.' };
}

// --- 2. CRIAR LOJA DO ZERO (PÚBLICO) ---
export async function cadastrarLoja(formData: FormData) {
  const nome_loja = formData.get('nome_loja');
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await fetch('http://127.0.0.1:8000/api/registrar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome_loja, email, password }),
  });

  if (response.ok) {
    // Se a loja foi criada com sucesso, já faz o login automático!
    return await realizarLogin(formData);
  }

  const data = await response.json();
  return { erro: data.erro || 'Erro ao criar a conta.' };
}

// --- 3. CRIAR PRODUTO ---
export async function criarProduto(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Sessão expirada. Faça login novamente.' };

  const nome = formData.get('nome');
  const preco = formData.get('preco');
  const categoria = formData.get('categoria');

  // Backend exige categoria (UUID) no POST /api/produtos/
  if (!categoria) {
    return { erro: 'Selecione uma categoria.' };
  }

  const response = await fetch('http://127.0.0.1:8000/api/produtos/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: nome, preco: preco, categoria }),
  });


  if (response.ok) {
    // Atualiza páginas server-renderizadas
    revalidatePath('/home');
    revalidatePath('/produtos');
    return { sucesso: true };
  }


  return { erro: 'Erro ao cadastrar o produto no servidor.' };
}

// --- 4. EXCLUIR PRODUTO ---
export async function excluirProduto(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Não autorizado' };

  const response = await fetch(`http://127.0.0.1:8000/api/produtos/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    revalidatePath('/home');
    return { sucesso: true };
  }

  return { erro: 'Erro ao excluir o produto.' };
}

// --- 5. ADICIONAR FUNCIONÁRIO (SÓ O DONO PODE) ---
export async function atualizarPrecosEmMassa(alteracoes: Array<{ id: string; preco: number }>) {

  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Sessão expirada. Faça login novamente.' };

  if (!Array.isArray(alteracoes) || alteracoes.length === 0) {
    return { erro: 'Nenhuma alteração informada.' };
  }

  const response = await fetch('http://127.0.0.1:8000/api/produtos/precos/massa/', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ alteracoes }),
  });

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    revalidatePath('/produtos');
    revalidatePath('/home');
    return { sucesso: true, mensagem: data.sucesso ?? 'Preços atualizados.' };
  }

  return { erro: data.erro || 'Erro ao atualizar preços no servidor.' };
}

// --- 6. ATUALIZAR QUANTIDADES EM MASSA ---
export async function atualizarQuantidadesEmMassa(alteracoes: Array<{ id: string; quantidade: number | null }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Sessão expirada. Faça login novamente.' };

  if (!Array.isArray(alteracoes) || alteracoes.length === 0) {
    return { erro: 'Nenhuma alteração informada.' };
  }

  const response = await fetch('http://127.0.0.1:8000/api/produtos/quantidades/massa/', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ alteracoes }),
  });

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    revalidatePath('/produtos');
    revalidatePath('/home');
    return { sucesso: true, mensagem: data.sucesso ?? 'Quantidades atualizadas.' };
  }

  return { erro: data.erro || 'Erro ao atualizar quantidades no servidor.' };
}

// --- 5. ADICIONAR FUNCIONÁRIO (SÓ O DONO PODE) ---
export async function adicionarFuncionario(formData: FormData) {


  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Sessão expirada. Faça login novamente.' };

  const email = formData.get('email');
  const password = formData.get('password');
  const cargo = formData.get('cargo');

  const response = await fetch('http://127.0.0.1:8000/api/equipe/novo/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, cargo }),
  });

  const data = await response.json();

  if (response.ok) {
    revalidatePath('/home');
    return { sucesso: true, mensagem: data.sucesso };
  }

  return { erro: data.erro || 'Erro ao cadastrar o funcionário no servidor.' };
}