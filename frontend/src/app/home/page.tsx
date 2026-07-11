import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Package, Grid } from 'lucide-react';

import ModalNovoProdutoWithCats from './ModalNovoProdutoWithCats';

import AppShell from '../components/AppShell';
import HomeProductosTable from './HomeProductosTable';



// Agora o Dashboard é Assíncrono e roda no Servidor!
export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;


  // Se não tem chave, manda pro login
  if (!token) {
    redirect('/');
  }

  // 2. O servidor do Next.js conversa com o servidor do Django
  const res = await fetch('http://127.0.0.1:8000/api/produtos/', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    next: { revalidate: 2 }
  });


  // Se o token expirou no meio do caminho, expulsa pro login
  if (!res.ok) {
    redirect('/');
  }

  // 3. Recebe os dados limpos
  const produtos = await res.json();

  // opções de filtro (categorias ativas = têm produtos)
  const categoriasAtivas = Array.from(
    new Map(
      (produtos as any[])
        .filter((p) => p?.categoria_nome)
        .map((p) => [p.categoria_nome as string, { nome: p.categoria_nome as string }])
    ).values()
  );

  const categorias = categoriasAtivas.length;

  return (
    <AppShell activeHref="/home">
      <div className="flex items-center justify-between mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Visão Geral do Sistema</h1>
          <p className="text-slate-400 text-lg">Gestão Inteligente FlowTrade</p>
        </div>
        <ModalNovoProdutoWithCats />
      </div>

      <div className="mt-2 flex items-center justify-between gap-6 flex-wrap">
        <div className="text-sm text-slate-400">
          Selecione uma categoria para exibir apenas os produtos dela.
        </div>
        {/* Lista abaixo controla o filtro no client */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">


        <div className="bg-[#1e293b]/50 border border-blue-500/30 rounded-2xl p-6 shadow-[0_4px_20px_rgba(59,130,246,0.1)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Package size={24} />
            <h3 className="font-medium">Total Produtos</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{produtos.length}</p>
        </div>

        <div className="bg-[#1e293b]/50 border border-purple-500/30 rounded-2xl p-6 shadow-[0_4px_20px_rgba(168,85,247,0.1)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <Grid size={24} />
            <h3 className="font-medium">Categorias Ativas</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{categorias}</p>
        </div>
      </div>

      <HomeProductosTable produtos={produtos} />

    </AppShell>
  );

}