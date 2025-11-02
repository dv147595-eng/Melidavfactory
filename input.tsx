
import React from 'react'
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${props.className||''}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea {...props} className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${props.className||''}`}/>;
}
