'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type RealtimeCtx = {
  lastUpdateAt: number;
};

const Ctx = createContext<RealtimeCtx>({ lastUpdateAt: 0 });

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdateAt, setLastUpdateAt] = useState(0);

  useEffect(() => {
    // Se o Supabase não estiver configurado (env vars ausentes), não faz subscribe.
    // Isso evita crash no runtime.
    if (!supabase) return;

    // MVP: como o front ainda não tem loja_id direto, subscrevemos sem filtro local.
    // O RLS do Supabase deve garantir que o usuário só receba eventos da própria loja.
    // Ao receber eventos, a gente dispara um "tick" pra telas refazerem fetch.

    const channel = supabase
      .channel('flowtrade-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estoque_produto' },
        () => setLastUpdateAt(Date.now())
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estoque_categoria' },
        () => setLastUpdateAt(Date.now())
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const value = useMemo(() => ({ lastUpdateAt }), [lastUpdateAt]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRealtime() {
  return useContext(Ctx);
}


