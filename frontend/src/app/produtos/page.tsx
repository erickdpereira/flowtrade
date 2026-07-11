import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UpdatePricesClient from './UpdatePricesClient';
import AppShell from '../components/AppShell';
import ModalNovoProduto from './ModalNovoProduto';


export default async function ProdutosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) redirect('/');

  const res = await fetch('http://127.0.0.1:8000/api/produtos/', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) redirect('/');

  const produtos = await res.json();

  return (
    <AppShell activeHref="/produtos">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Estoque e preços</h1>
          <p className="text-slate-400 text-lg">Esses dados refletem a loja logada.</p>
        </div>
        <ModalNovoProduto />
      </div>

      <UpdatePricesClient initialProdutos={produtos} />
    </AppShell>
  );
}

