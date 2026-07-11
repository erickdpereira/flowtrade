'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Grid as GridIcon, LayoutDashboard as LayoutDashboardIcon, Package as PackageIcon } from 'lucide-react';
import LogoFlowTrade from './LogoFlowTrade';
import UserMenu from './ui/UserMenu';

import { logout } from '../actions/authActions';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

export default function AppShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  const nav: NavItem[] = [
    {
      href: '/home',
      label: 'Dashboard',
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: '/produtos',
      label: 'Produtos',
      icon: <PackageIcon size={20} />,
    },
    {
      href: '/categorias',
      label: 'Categorias',
      icon: <GridIcon size={20} />,
    },
    {
      href: '/equipe',
      label: 'Equipe',
      icon: <GridIcon size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-white/5 to-white/0 border-r border-white/10 flex flex-col justify-between">

        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <LogoFlowTrade />
          </div>

          <nav className="p-4 space-y-2">
            {nav.map((item) => {
              const active = activeHref ? item.href === activeHref : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all'
                      : 'flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all'
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold">
              ED
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Administrador</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-md sticky top-0 z-10">

          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
            <h2 className="text-lg font-medium text-slate-400">FlowTrade</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors" type="button">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0f172a]" />
            </button>

            {/* Menu perfil */}
            <UserMenu onLogout={logout} />
          </div>

        </header>

        <div className="p-8 space-y-8">{children}</div>
      </main>
    </div>
  );
}

