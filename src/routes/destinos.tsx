import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DESTINOS, type Destino } from "@/lib/destinos";
import { DestinoCard } from "@/components/DestinoCard";

export const Route = createFileRoute("/destinos")({
  component: DestinosPage,
  head: () => ({
    meta: [
      { title: "Destinos & Expedições — Dumas Trekk" },
      { name: "description", content: "Encontre trilhas, montanhas e expedições cuidadosamente planejadas. Filtre por nível, tipo, preço e duração." },
      { property: "og:title", content: "Destinos & Expedições — Dumas Trekk" },
      { property: "og:url", content: "/destinos" },
    ],
    links: [{ rel: "canonical", href: "/destinos" }],
  }),
});

const NIVEIS: Destino["nivel"][] = ["Fácil", "Moderado", "Difícil", "Expedição"];
const TIPOS: Destino["tipo"][] = ["Trekking", "Cachoeiras", "Montanhismo", "Acampamento"];

function DestinosPage() {
  const [q, setQ] = useState("");
  const [nivel, setNivel] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [preco, setPreco] = useState<number>(15000);

  const list = useMemo(() => {
    return DESTINOS.filter((d) => {
      if (nivel && d.nivel !== nivel) return false;
      if (tipo && d.tipo !== tipo) return false;
      if (d.precoDesde > preco) return false;
      if (q && !(`${d.nome} ${d.local} ${d.estado}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, nivel, tipo, preco]);

  return (
    <>
      <section className="relative bg-forest-deep pb-20 pt-40 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-widest text-white/70">Destinos</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-6xl">Escolha sua próxima expedição.</h1>
          <p className="mt-4 max-w-xl text-white/80">Filtre por nível, tipo, preço e duração. Vagas limitadas por saída.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Filtros */}
        <div className="glass mb-12 flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center md:gap-6 md:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar destino, estado, montanha..."
              className="w-full rounded-full border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="rounded-full border border-input bg-background px-4 py-2.5 text-sm">
            <option value="">Todos os níveis</option>
            {NIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-full border border-input bg-background px-4 py-2.5 text-sm">
            <option value="">Todos os tipos</option>
            {TIPOS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <label className="flex items-center gap-3 text-xs text-muted-foreground">
            Preço até R$ {preco.toLocaleString("pt-BR")}
            <input type="range" min={1000} max={15000} step={500} value={preco} onChange={(e) => setPreco(Number(e.target.value))} className="accent-primary" />
          </label>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => <DestinoCard key={d.slug} d={d} />)}
        </div>
        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">Nenhuma expedição encontrada com esses filtros.</p>}
      </section>
    </>
  );
}
