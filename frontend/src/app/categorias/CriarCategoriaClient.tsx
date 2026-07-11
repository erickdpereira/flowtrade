'use client';

import { useState } from 'react';
import { createCategoria } from './actions';

export default function CriarCategoriaClient({ onCreated }: { onCreated?: () => void }) {
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  return (
    <form
      className="space-y-3 bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
          const r = await createCategoria(nome);
          if (r?.erro) {
            setErro(r.erro);
          } else {
            setNome('');
            onCreated?.();
          }
        } finally {
          setCarregando(false);
        }
      }}
    >
      <h3 className="text-lg font-medium text-white">Nova categoria</h3>

      {erro && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
          {erro}
        </div>
      )}

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
        placeholder="Nome da categoria"
        required
      />

      <button
        type="submit"
        disabled={carregando}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      >
        {carregando ? 'Salvando...' : 'Criar categoria'}
      </button>
    </form>
  );
}

