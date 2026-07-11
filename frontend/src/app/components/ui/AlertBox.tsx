import React from 'react';

export function AlertBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-700/60 bg-white/5">
      {title ? (
        <p className="text-xs font-semibold tracking-wide text-slate-200">{title}</p>
      ) : null}
      <div className="mt-2 text-sm text-slate-300">{children}</div>
    </div>
  );
}

