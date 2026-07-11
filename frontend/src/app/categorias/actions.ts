'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createCategoria(nome: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) return { erro: 'Sessão expirada. Faça login novamente.' };
  if (!nome?.trim()) return { erro: 'Informe o nome da categoria.' };

  const response = await fetch('http://127.0.0.1:8000/api/categorias/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: nome.trim() }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { erro: data.erro || 'Erro ao criar categoria.' };
  }

  revalidatePath('/categorias');
  return { sucesso: true };
}

