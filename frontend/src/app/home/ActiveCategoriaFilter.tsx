'use client';

import { useMemo, useState } from 'react';

type CategoriaOption = {
  id?: string;
  nome: string;
};

export default function ActiveCategoriaFilter({
  categorias,
  onChange,
}: {
  categorias: CategoriaOption[];
  onChange: (categoriaNome: string | 'todas') => void;
}) {
  const options = useMemo(() => {
    const unique = new Map<string, CategoriaOption>();
    for (const c of categorias) {
      if (!c?.nome) continue;
      unique.set(c.nome, c);
    }
    return Array.from(unique.values());
  }, [categorias]);

  const [value, setValue] = useState<string | 'todas'>('todas');

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm font-medium text-slate-300">Filtrar por categoria</label>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as string | 'todas';
          setValue(next);
          onChange(next);
        }}
        className="bg-[#0f172a]/80 border border-slate-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
      >
        <option value="todas">Todas</option>
        {options.map((c) => (
          <option key={c.id ?? c.nome} value={c.nome}>
            {c.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

