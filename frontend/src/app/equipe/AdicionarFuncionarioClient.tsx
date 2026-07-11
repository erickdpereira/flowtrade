'use client';

import { useState } from 'react';
import { adicionarFuncionario } from '../actions';

export default function AdicionarFuncionarioClient({
  canManage,
}: {
  canManage: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('Caixa');

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');

  if (!canManage) {
    return (
      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm mt-6">
        <p className="text-slate-300">Apenas o dono pode adicionar funcionários.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        onClick={() => {
          setIsOpen(true);
          setErro('');
          setOk('');
        }}
      >
        Adicionar na equipe
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-white mb-6 tracking-tight">
              Adicionar funcionário
            </h2>

            {erro ? (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
                {erro}
              </div>
            ) : null}

            {ok ? (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-300 text-sm rounded-lg text-center">
                {ok}
              </div>
            ) : null}

            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setCarregando(true);
                setErro('');
                setOk('');

                const fd = new FormData();
                fd.set('email', email);
                fd.set('password', password);
                fd.set('cargo', cargo);

                const r = await adicionarFuncionario(fd);

                if ((r as any)?.erro) {
                  setErro((r as any).erro);
                } else {
                  setOk((r as any)?.mensagem || 'Funcionário adicionado com sucesso!');
                  setIsOpen(false);
                }

                setCarregando(false);
              }}
            >
              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full mt-2 bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  placeholder="funcionario@exemplo.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full mt-2 bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Cargo</label>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full mt-2 bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="Caixa">Caixa</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Atendente">Atendente</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {carregando ? 'Salvando...' : 'Adicionar'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

