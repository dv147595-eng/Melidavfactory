
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input, Textarea } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import {
  CalendarDays,
  Music4,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  Download,
  Upload,
  Printer,
} from "lucide-react";

// --- Utils ---
const Croissant = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12a8 8 0 0 1 8-8 6 6 0 0 0 6 6 8 8 0 0 1-8 8 6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const money = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

function downloadText(filename: string, data: string) {
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function toCSV(rows: Record<string, any>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(",")));
  return lines.join("\n");
}

// --- Demo Data ---
const demoProducts = [
  { id: "p1", name: "Baguette tradition", price: 1.3 },
  { id: "p2", name: "Pain complet", price: 2.4 },
  { id: "p3", name: "Croissant", price: 1.1 },
];
const demoEvents = [
  { id: "e1", title: "Concert indie – Café des Arts", date: "2025-11-15", capacity: 120 },
  { id: "e2", title: "Soirée électro – Le Warehouse", date: "2025-12-05", capacity: 350 },
];
const demoCases = [
  { id: "c1", title: "Flux circulaires – Compte SG", note: "Vérifier les virements LOGITEL et dépôts espèces." },
  { id: "c2", title: "Plateformes – Vinted/YOOX", note: "Comparer les remboursements et ventes réelles." },
];

export default function AppStarter() {
  const [tab, setTab] = useState("dashboard");
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 pb-24">
      <div className="mx-auto max-w-6xl p-6">
        <Header onChangeTab={setTab} />
        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl">
            <TabsTrigger value="dashboard">Aperçu</TabsTrigger>
            <TabsTrigger value="bakery">Boulangerie</TabsTrigger>
            <TabsTrigger value="events">Événementiel</TabsTrigger>
            <TabsTrigger value="cases">Dossier enquête</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><Dashboard /></TabsContent>
          <TabsContent value="bakery"><BakeryModule /></TabsContent>
          <TabsContent value="events"><EventsModule /></TabsContent>
          <TabsContent value="cases"><CasesModule /></TabsContent>
        </Tabs>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl grid grid-cols-4">
          {[
            { k: "dashboard", label: "Aperçu" },
            { k: "bakery", label: "Boul" },
            { k: "events", label: "Évts" },
            { k: "cases", label: "PV" },
          ].map(x => (
            <button key={x.k} onClick={() => setTab(x.k)} className={`py-3 text-sm font-medium ${tab===x.k?"text-slate-900":"text-slate-500"}`}>{x.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ onChangeTab }: { onChangeTab: (tab: string) => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord polyvalent</h1>
        <p className="text-slate-600">Boulangerie • Événementiel musical • Notes d'enquête</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onChangeTab("bakery")}>Boulangerie</Button>
        <Button onClick={() => onChangeTab("events")}>Événements</Button>
        <Button onClick={() => onChangeTab("cases")}>Enquête</Button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, hint }: any) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-5 w-5 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const revenue = 2456.3;
  const tickets = 214;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard icon={Croissant} title="Ventes boulangerie" value={money(revenue)} hint="30 derniers jours" />
      <StatCard icon={Music4} title="Tickets vendus" value={tickets} hint="Prochains événements" />
      <StatCard icon={ShieldCheck} title="Dossiers actifs" value={4} hint="Suivi prioritaire" />
      <Card className="rounded-2xl md:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Calendrier rapide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <ul className="list-disc pl-5 space-y-1">
            <li>15 nov. 2025 — Concert indie (café des Arts)</li>
            <li>05 déc. 2025 — Soirée électro (Warehouse)</li>
            <li>Chaque matin — Prépa pâtons & fournée 6h</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function BakeryModule() {
  const [products, setProducts] = useLocalStorage<typeof demoProducts>("bakery.products", demoProducts);
  const [cart, setCart] = useLocalStorage<{ id: string; qty: number }[]>("bakery.cart", []);
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tva, setTva] = useLocalStorage<number>("bakery.tva", 5.5);
  const [remise, setRemise] = useLocalStorage<number>("bakery.remise", 0);

  const list = useMemo(() => products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())), [products, filter]);
  const sousTotal = useMemo(() => cart.reduce((sum, line) => { const p = products.find(x => x.id === line.id); return sum + (p ? p.price * line.qty : 0); }, 0), [cart, products]);
  const montantRemise = useMemo(() => sousTotal * (remise/100), [sousTotal, remise]);
  const baseTva = useMemo(() => Math.max(0, sousTotal - montantRemise), [sousTotal, montantRemise]);
  const montantTva = useMemo(() => baseTva * (tva/100), [baseTva, tva]);
  const total = useMemo(() => baseTva + montantTva, [baseTva, montantTva]);

  function addProduct() { if (!name || !price) return; setProducts(prev => [...prev, { id: Math.random().toString(36).slice(2), name, price: Number(price) }]); setName(""); setPrice(""); }
  function addToCart(id: string) { setCart(prev => { const f = prev.find(l => l.id === id); return f ? prev.map(l => l.id===id?{...l, qty:l.qty+1}:l) : [...prev, { id, qty: 1 }]; }); }
  function removeFromCart(id: string) { setCart(prev => prev.filter(l => l.id !== id)); }
  function clearCart() { setCart([]); }

  function makeReceiptText() {
    const lines = cart.map(l => { const p = products.find(x => x.id === l.id)!; return `${p.name} x${l.qty} — ${money(p.price * l.qty)}`; }).join("\\n");
    return `Ticket Boulangerie\\n${new Date().toLocaleString("fr-FR")}\\n\\n${lines}\\n\\nSous-total: ${money(sousTotal)}\\nRemise (${remise}%): -${money(montantRemise)}\\nBase TVA: ${money(baseTva)}\\nTVA (${tva}%): ${money(montantTva)}\\nTOTAL TTC: ${money(total)}`;
  }

  function printReceipt() {
    const w = window.open("", "_blank", "width=400,height=600"); if (!w) return;
    w.document.write(`<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap;">${makeReceiptText()}</pre>`);
    w.print();
  }

  async function pdfReceipt() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFont("helvetica", ""); doc.setFontSize(12);
    const lines = makeReceiptText().split("\\n");
    let y = 40; lines.forEach(line => { doc.text(line, 40, y); y += 18; });
    doc.save("ticket.pdf");
  }

  function exportProductsCSV() { downloadText("produits.csv", toCSV(products)); }
  function exportCartCSV() {
    const rows = cart.map(l => { const p = products.find(x => x.id === l.id)!; return { produit: p.name, quantite: l.qty, prix_unitaire: p.price, total_ht: (p.price * l.qty) }; });
    downloadText("panier.csv", toCSV(rows));
  }
  function importProductsJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)); if (Array.isArray(parsed)) setProducts(parsed as any); } catch {} };
    reader.readAsText(file);
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2"><Croissant className="h-5 w-5" /> Catalogue produits</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher..." className="pl-8" />
            </div>
            <input id="import-json" type="file" accept="application/json" className="hidden" onChange={importProductsJSON} />
            <Button variant="outline" onClick={exportProductsCSV}><Download className="h-4 w-4" />&nbsp;CSV</Button>
            <Button variant="outline" onClick={() => document.getElementById("import-json")?.click()}><Upload className="h-4 w-4" />&nbsp;Import JSON</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map(p => (
              <motion.div key={p.id} layout>
                <Card className="rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="font-semibold">{money(p.price)}</span>
                    <Button onClick={() => addToCart(p.id)}><Plus className="h-4 w-4" />&nbsp;Ajouter</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle>Panier</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence initial={false}>
            {cart.map(line => { const p = products.find(x => x.id === line.id)!; return (
              <motion.div key={line.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-between rounded-xl border p-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">Qté {line.qty} • {money(p.price * line.qty)}</div>
                </div>
                <Button variant="outline" onClick={() => removeFromCart(line.id)}><Trash2 className="h-4 w-4" /></Button>
              </motion.div>
            );})}
          </AnimatePresence>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs text-slate-500">TVA %</label>
              <Input type="number" value={tva} onChange={e => setTva(Number((e.target as HTMLInputElement).value||0))} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500">Remise %</label>
              <Input type="number" value={remise} onChange={e => setRemise(Number((e.target as HTMLInputElement).value||0))} />
            </div>
          </div>
          <div className="space-y-1 text-sm text-slate-600 border-t pt-2">
            <div className="flex justify-between"><span>Sous-total</span><span>{money(sousTotal)}</span></div>
            <div className="flex justify-between"><span>Remise</span><span>-{money(montantRemise)}</span></div>
            <div className="flex justify-between"><span>Base TVA</span><span>{money(baseTva)}</span></div>
            <div className="flex justify-between"><span>TVA</span><span>{money(montantTva)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total TTC</span><span>{money(total)}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={printReceipt}><Printer className="h-4 w-4" />&nbsp;Imprimer</Button>
            <Button variant="outline" onClick={pdfReceipt}>PDF</Button>
            <Button variant="outline" onClick={exportCartCSV}><Download className="h-4 w-4" />&nbsp;CSV</Button>
          </div>
          <Button variant="outline" onClick={clearCart}>Vider le panier</Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl md:col-span-3">
        <CardHeader><CardTitle>Ajouter un produit</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Nom" value={name} onChange={e => setName((e.target as HTMLInputElement).value)} />
          <Input type="number" placeholder="Prix (€)" value={price} onChange={e => setPrice((e.target as HTMLInputElement).value)} />
          <Button onClick={addProduct}><Plus className="h-4 w-4" />&nbsp;Ajouter</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EventsModule() {
  const [events, setEvents] = useLocalStorage<(typeof demoEvents)[number] & { sold?: number }[]>("events.list", demoEvents.map(e=>({ ...e, sold: 0 })));
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [scanId, setScanId] = useState<string | null>(null);

  function addEvent() { if (!title || !date) return; setEvents(prev => [...prev, { id: Math.random().toString(36).slice(2), title, date, capacity: Number(capacity || 0), sold: 0 }]); setTitle(""); setDate(""); setCapacity(""); }
  function removeEvent(id: string) { setEvents(prev => prev.filter(e => e.id !== id)); }
  function exportCSV() { downloadText("evenements.csv", toCSV(events)); }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2"><Music4 className="h-5 w-5" /> Événements</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4" />&nbsp;CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {events.map(ev => (
            <motion.div key={ev.id} layout className="rounded-xl border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-slate-500">{new Date(ev.date).toLocaleDateString("fr-FR")} • Capacité {ev.capacity || "—"}</div>
                </div>
                <div className="text-right text-sm">
                  <div>Vendus: <span className="font-semibold">{ev.sold ?? 0}</span></div>
                  <div>Restants: <span className="font-semibold">{Math.max(0, (ev.capacity||0) - (ev.sold||0))}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setEvents(prev => prev.map(e => e.id===ev.id?{...e, sold: (e.sold||0)+1}:e))}>+1 ticket</Button>
                <Button variant="outline" onClick={() => setScanId(ev.id)}>Scanner QR</Button>
                <Button variant="outline" onClick={() => removeEvent(ev.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          ))}

          {scanId && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-4 w-full max-w-sm space-y-3">
                <div className="font-semibold">Scanner des billets</div>
                <div className="text-sm text-slate-600">Cadrez le QR code. Chaque scan valide incrémente le compteur.</div>
                <QRScanner onValid={() => { setEvents(prev => prev.map(e => e.id===scanId?{...e, sold:(e.sold||0)+1}:e)); }} />
                <Button variant="outline" onClick={() => setScanId(null)}>Terminer</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle>Nouveau</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Titre" value={title} onChange={e => setTitle((e.target as HTMLInputElement).value)} />
          <Input type="date" value={date} onChange={e => setDate((e.target as HTMLInputElement).value)} />
          <Input type="number" placeholder="Capacité" value={capacity} onChange={e => setCapacity((e.target as HTMLInputElement).value)} />
          <Button onClick={addEvent}><Plus className="h-4 w-4" />&nbsp;Ajouter</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function QRScanner({ onValid }: { onValid: () => void }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => { setSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)); }, []);
  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      if (!supported) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      } catch {}
    })();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [supported]);
  return (
    <div className="grid gap-2">
      <div className="rounded-xl border aspect-video flex items-center justify-center text-slate-500 text-sm">Aperçu caméra</div>
      <Button onClick={onValid}>Scan OK</Button>
      <div className="text-xs text-slate-500">Astuce iPhone: autorise l'accès à la caméra lorsqu'iOS le demande.</div>
    </div>
  );
}

function CasesModule() {
  const [cases, setCases] = useLocalStorage<typeof demoCases>("cases.list", demoCases);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  function addCase() { if (!title) return; setCases(prev => [...prev, { id: Math.random().toString(36).slice(2), title, note }]); setTitle(""); setNote(""); }
  function removeCase(id: string) { setCases(prev => prev.filter(c => c.id !== id)); }
  function exportCSV() { downloadText("dossiers.csv", toCSV(cases)); }
  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const date = new Date().toLocaleString("fr-FR");
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("Procès-verbal – Notes d'enquête", 40, 50);
    doc.setFont("helvetica", ""); doc.setFontSize(10); doc.text(`Export: ${date}`, 40, 70);
    let y = 100; cases.forEach((c, i) => { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(`${i+1}. ${c.title}`, 40, y); y+=18; doc.setFont("helvetica", ""); doc.setFontSize(11); (c.note||"—").split(/\\n|\\r/).forEach(line=>{ doc.text(line, 52, y); y+=16; }); y+=8; if (y > 760) { doc.addPage(); y=60; } });
    doc.save("pv-notes.pdf");
  }
  function importJSON(e: React.ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; const r=new FileReader(); r.onload=()=>{ try{ const p=JSON.parse(String(r.result)); if(Array.isArray(p)) setCases(p as any);}catch{}}; r.readAsText(file); }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Dossiers</CardTitle>
          <div className="flex items-center gap-2">
            <input id="import-cases" type="file" accept="application/json" className="hidden" onChange={importJSON} />
            <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4" />&nbsp;CSV</Button>
            <Button variant="outline" onClick={exportPDF}>PDF</Button>
            <Button variant="outline" onClick={() => (document.getElementById("import-cases") as HTMLInputElement)?.click()}><Upload className="h-4 w-4" />&nbsp;Import JSON</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {cases.map(c => (
            <motion.div key={c.id} layout className="rounded-xl border p-3">
              <div className="font-medium">{c.title}</div>
              {c.note && <div className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{c.note}</div>}
              <div className="flex justify-end mt-2">
                <Button variant="outline" onClick={() => removeCase(c.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle>Nouveau dossier</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Titre" value={title} onChange={e => setTitle((e.target as HTMLInputElement).value)} />
          <Textarea placeholder="Note (optionnel)" value={note} onChange={e => setNote((e.target as HTMLInputElement).value)} />
          <Button onClick={addCase}><Plus className="h-4 w-4" />&nbsp;Ajouter</Button>
        </CardContent>
      </Card>
    </div>
  );
}
