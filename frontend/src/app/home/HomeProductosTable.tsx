'use client';

import { useMemo, useState } from 'react';
import ActiveCategoriaFilter from './ActiveCategoriaFilter';

type Produto = {
  id: string;
  nome: string;
  preco: string | number;
  categoria_nome?: string | null;
};

export default function HomeProductosTable({
  produtos,
}: {
  produtos: Produto[];
}) {
  const categoriasAtivas = useMemo(() => {
    const unique = new Map<string, { nome: string }>();
    for (const p of produtos) {
      if (!p?.categoria_nome) continue;
      unique.set(p.categoria_nome, { nome: p.categoria_nome });
    }
    return Array.from(unique.values());
  }, [produtos]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | 'todas'>('todas');

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === 'todas') return produtos;
    return produtos.filter((p) => p.categoria_nome === categoriaSelecionada);
  }, [produtos, categoriaSelecionada]);

  return (
    <div className="space-y-4">
      <div className="mt-2 flex items-center justify-between gap-6 flex-wrap">
        <div className="text-sm text-slate-400">Exibir por categoria ativa</div>
        <ActiveCategoriaFilter
          categorias={categoriasAtivas}
          onChange={(nome) => setCategoriaSelecionada(nome)}
        />
      </div>

      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-medium text-white mb-6">Estoque Sincronizado</h3>

        <div className="space-y-4">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-cyan-400 font-bold border border-slate-600">
                  {produto.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{produto.nome}</p>
                  <p className="text-sm text-slate-400">{produto.categoria_nome || 'Geral'}</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <p className="text-lg font-bold text-emerald-400">R$ {produto.preco}</p>
              </div>
            </div>
          ))}

          {produtosFiltrados.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhum produto para a categoria selecionada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

