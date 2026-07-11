'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function fetchCategoriasDoToken(): Promise<{ categorias: any[] } | { erro: string }> {

  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;


  if (!token) {
    return { erro: 'Sessão expirada. Faça login novamente.' } as const;
  }

  const res = await fetch('http://127.0.0.1:8000/api/categorias/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { erro: data.erro || 'Erro ao carregar categorias.' } as const;
  }

  // revalidate opcional (não precisa, mas mantém consistente com o resto do app)
  revalidatePath('/home');

  return { categorias: data } as const;
}

