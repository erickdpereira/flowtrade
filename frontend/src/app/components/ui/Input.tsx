import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({
  label,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={`w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/60 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

