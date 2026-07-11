'use client';

import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

export default function UserMenu({
  onLogout,
}: {
  onLogout: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold">
          ED
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-bold text-white leading-tight">Administrador</p>
          <p className="text-xs text-slate-500 leading-tight">Conta</p>
        </div>
        <ChevronDown size={16} className="text-slate-500" />
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-slate-800 rounded-xl shadow-[0_0_25px_rgba(2,132,199,0.15)] z-20 overflow-hidden">
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await onLogout();
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <LogOut size={16} className="text-red-400" />
            <span className="text-sm">Sair da conta</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

