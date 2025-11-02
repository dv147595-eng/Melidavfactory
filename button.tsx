
import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' }
export function Button({ className='', variant, ...props }: Props) {
  const base = 'inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md shadow-sm transition active:scale-[.98]';
  const solid = 'bg-slate-900 text-white hover:bg-slate-800';
  const outline = 'border border-slate-300 text-slate-700 hover:bg-slate-100';
  const cls = `${base} ${variant==='outline'?outline:solid} ${className}`;
  return <button {...props} className={cls} />;
}
