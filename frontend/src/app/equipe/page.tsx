import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppShell from '../components/AppShell';
import AdicionarFuncionarioClient from './AdicionarFuncionarioClient';


export default async function EquipePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('flowtrade_token')?.value;

  if (!token) redirect('/');

  return (
    <AppShell activeHref="/equipe">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Equipe</h1>
        <p className="text-slate-400 text-lg">
          Gerencie funcionários (somente o dono).
        </p>
      </div>

      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm mt-6">
        <p className="text-slate-300">
          Use o formulário abaixo para adicionar um membro. Se você não for o dono, a API vai negar.
        </p>
      </div>

      <AdicionarFuncionarioClient canManage={true} />

    </AppShell>
  );
}


