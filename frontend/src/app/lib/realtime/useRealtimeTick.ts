'use client';

import { useEffect, useState } from 'react';
import { useRealtime } from './RealtimeProvider';

/**
 * Hook utilitário para telas: retorna um valor de "tick" que muda quando o Realtime recebe eventos.
 * Use para disparar refetch no client.
 */
export function useRealtimeTick() {
  const { lastUpdateAt } = useRealtime();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (lastUpdateAt > 0) setTick(Date.now());
  }, [lastUpdateAt]);

  return tick;
}

