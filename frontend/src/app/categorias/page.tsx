import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppShell from '../components/AppShell';
import CriarCategoriaClient from './CriarCategoriaClient';

export default async function CategoriasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) redirect('/');

  const res = await fetch('http://127.0.0.1:8000/api/categorias/', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) redirect('/');

  const categorias = await res.json();

  return (
    <AppShell activeHref="/categorias">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Gerencie suas categorias</h1>
        <p className="text-slate-400 text-lg">Essas categorias refletem a loja logada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6">Criar categoria</h3>
          <CriarCategoriaClient />
        </div>

        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6">Lista</h3>
          <div className="space-y-3">
            {categorias.length === 0 && (
              <div className="text-center py-8 text-slate-500">Nenhuma categoria cadastrada.</div>
            )}
            {categorias.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl"
              >
                <div>
                  <p className="text-white font-medium">{c.nome}</p>
                  <p className="text-sm text-slate-400">ID: {c.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}


