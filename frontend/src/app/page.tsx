'use client';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { realizarLogin } from './actions'; // Importando a ação segura

export default function LoginPage() {

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    // Pega os dados do formulário
    const formData = new FormData(e.currentTarget);
    
    // Chama a função segura que roda no servidor
    const resultado = await realizarLogin(formData);

    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#0f172a] border border-slate-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Zap className="text-cyan-400" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">FlowTrade</h1>
          <p className="text-slate-400 mt-2 text-sm">Acesse o seu painel de gestão</p>
        </div>

        {/* Exibe o erro se as credenciais estiverem erradas */}
        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Usuário</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="email"
                type="text" 
                required
                placeholder="admin" 
                className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="password"
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            {carregando ? 'Conectando...' : 'Entrar no Sistema'}
            {!carregando && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/cadastro"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            Ainda não tenho conta — criar loja
          </a>
        </div>
      </div>
    </div>
  );
}