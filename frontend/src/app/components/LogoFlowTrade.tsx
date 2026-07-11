'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function LogoFlowTrade() {
  return (
    <Link
      href="/home"
      className="group inline-flex items-center gap-3 select-none"
      aria-label="Voltar para o dashboard"
    >
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-blue-500/20 border border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.18)] flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Zap className="text-cyan-300" size={20} />
      </div>

      <div className="leading-tight">
        <div className="text-white text-lg font-black tracking-tight">
          FlowTrade
        </div>
        <div className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
          Gestão de Loja
        </div>
      </div>
    </Link>
  );
}

