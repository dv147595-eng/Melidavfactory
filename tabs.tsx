
import React from 'react'
export function Tabs({ value, onValueChange, children, className='' }: any){ return <div className={className}>{children}</div> }
export function TabsList({ children, className='' }: any){ return <div className={`flex gap-2 ${className}`}>{children}</div> }
export function TabsTrigger({ value, children }: any){ return <button className="px-3 py-2 rounded-md border border-slate-300 text-sm" onClick={()=> { const ev = new CustomEvent('tabs:set',{ detail: value }); window.dispatchEvent(ev); }}>{children}</button> }
export function TabsContent({ value, children }: any){
  const [v,setV] = React.useState<string|null>(null);
  React.useEffect(()=>{
    const h = (e: any)=>setV(e.detail);
    window.addEventListener('tabs:set',h as any);
    return ()=>window.removeEventListener('tabs:set',h as any);
  },[]);
  return <div style={{ display: v===null || v===value ? 'block':'none' }}>{children}</div>;
}
