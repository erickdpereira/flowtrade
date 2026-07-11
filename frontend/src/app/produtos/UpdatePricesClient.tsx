'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRealtimeTick } from '../lib/realtime/useRealtimeTick';

import ActiveCategoriaFilter from '../home/ActiveCategoriaFilter';
import { atualizarPrecosEmMassa, atualizarQuantidadesEmMassa } from '../action';



type Produto = {
  id: string;
  nome: string;
  preco: string | number;
  categoria_nome?: string | null;
};


export default function UpdatePricesClient({
  initialProdutos,
}: {
  initialProdutos: Produto[];
}) {
  const tick = useRealtimeTick();


  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);

  // sincroniza lista quando vem nova (ex: após refetch)
  useEffect(() => {
    setProdutos(initialProdutos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProdutos]);


  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | 'todas'>('todas');

  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(search);


  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const categoriasAtivas = useMemo(() => {
    const unique = new Map<string, { nome: string }>();
    for (const p of produtos) {
      if (!p?.categoria_nome) continue;
      unique.set(p.categoria_nome, { nome: p.categoria_nome });
    }
    return Array.from(unique.values());
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    let list = produtos;
    if (categoriaSelecionada !== 'todas') {
      list = list.filter((p) => p.categoria_nome === categoriaSelecionada);
    }

    if (!term) return list;
    return list.filter((p) => (p.nome || '').toLowerCase().includes(term));
  }, [produtos, debouncedSearch, categoriaSelecionada]);


  const [precos, setPrecos] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const p of initialProdutos) m[p.id] = String(p.preco ?? '');
    return m;
  });

  const [salvando, setSalvando] = useState(false);





  // Como seu backend atual só trabalha com preço, mantemos apenas alterações de preço.
  // (quantidade não existe no model/serializer atual)
  const alteracoesQtd = useMemo(() => {
    return [] as Array<{ id: string; quantidade: number | null }>;
  }, []);


  const alteracoes = useMemo(() => {

    const changes: Array<{ id: string; preco: number }> = [];

    for (const p of produtos) {
      const novo = precos[p.id];
      if (novo === undefined) continue;

      const n = Number(novo);
      if (!Number.isFinite(n)) continue;

      if (String(p.preco) !== String(n)) changes.push({ id: p.id, preco: n });
    }

    return changes;
  }, [produtos, precos]);

  return (
    <div className="mt-6">
      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-medium text-white mb-4">Atualizar preços (em massa)</h3>
        <div className="mb-4 space-y-2">
          <p className="text-sm text-slate-400">
            Edite <b>preço</b> e clique em <b>Salvar alterações</b>.
          </p>


          <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/30">
            <p className="text-xs text-slate-300">
              Avisos:
            </p>
            <ul className="text-xs text-slate-400 list-disc ml-5 mt-1 space-y-1">
              <li>Atualizações são enviadas em lote e refletidas via Realtime.</li>
              <li>Se você deixar o campo em branco, a quantidade vai para <b>null</b> (ou “—”).</li>
            </ul>
          </div>
        </div>


        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-medium text-slate-300">Filtrar por nome</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex: Teclado"
              className="w-full sm:w-80 bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="text-sm text-slate-400">Exibir por categoria ativa</div>
            <ActiveCategoriaFilter
              categorias={categoriasAtivas}
              onChange={(nome) => setCategoriaSelecionada(nome)}
            />
          </div>
        </div>


        <div className="space-y-3">
          {produtosFiltrados.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              {produtos.length === 0
                ? 'Nenhum produto cadastrado.'
                : 'Nenhum produto encontrado para o nome informado.'}
            </div>
          )}

          {produtosFiltrados.map((p) => (

            <div
              key={p.id}
              className="flex items-center justify-between gap-4 p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl"
            >
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{p.nome}</p>
                <p className="text-xs text-slate-400 truncate">{p.categoria_nome || 'Geral'}</p>


              </div>

              <div className="flex items-center gap-3">
                {/* Preço */}
                <div className="text-right">

                  <div className="text-[11px] text-slate-500 mb-1">Preço atual</div>
                  <div className="text-xs text-slate-200 mb-1">R$ {p.preco}</div>
                </div>

                <input
                  className="w-32 bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-3 py-2 text-right focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  type="number"
                  step="0.01"
                  value={precos[p.id] ?? ''}
                  onChange={(e) =>
                    setPrecos((prev) => ({ ...prev, [p.id]: e.target.value }))
                  }
                  placeholder=""
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-slate-400">
            Preços: {alteracoes.length} {tick ? '' : ''} | Quantidades: {alteracoesQtd.length}
          </div>

          <button
            type="button"
            disabled={(alteracoes.length === 0 && alteracoesQtd.length === 0) || salvando}

            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            onClick={async () => {
              setSalvando(true);
              try {
                if (alteracoesQtd.length > 0) {
                  await atualizarQuantidadesEmMassa(alteracoesQtd);
                }
                if (alteracoes.length > 0) {
                  await atualizarPrecosEmMassa(alteracoes);
                }
              } finally {
                setSalvando(false);
              }
            }}
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

