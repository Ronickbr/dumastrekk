import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchDestinos, destinosQueryKey } from "@/lib/destinos";
import { DestinoCard } from "@/components/DestinoCard";

export const Route = createFileRoute("/destinos/")({
  component: DestinosPage,
  head: () => ({
    meta: [
      { title: "Destinos & Expedições — Dumas Trekk" },
      { name: "description", content: "Encontre trilhas, montanhas e expedições cuidadosamente planejadas. Filtre por nível, tipo, preço e duração." },
      { property: "og:title", content: "Destinos & Expedições — Dumas Trekk" },
      { property: "og:description", content: "Encontre trilhas, montanhas e expedições cuidadosamente planejadas." },
      { property: "og:url", content: "https://dumastrekk.lovable.app/destinos" },
    ],
    links: [{ rel: "canonical", href: "https://dumastrekk.lovable.app/destinos" }],
  }),
});

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const FAIXAS_PRECO = [
  { label: "Qualquer valor", min: 0, max: Infinity },
  { label: "Até R$ 2.000", min: 0, max: 2000 },
  { label: "R$ 2.000 – R$ 5.000", min: 2000, max: 5000 },
  { label: "R$ 5.000 – R$ 10.000", min: 5000, max: 10000 },
  { label: "Acima de R$ 10.000", min: 10000, max: Infinity },
];

function mesDoDestino(data: string): string | null {
  const match = data.match(/(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)/);
  return match ? match[1] : null;
}

function DestinosPage() {
  const [q, setQ] = useState("");
  const [mes, setMes] = useState<string>("");
  const [faixa, setFaixa] = useState<number>(0);

  const { data: destinos = [], isLoading } = useQuery({
    queryKey: destinosQueryKey,
    queryFn: fetchDestinos,
  });

  const list = useMemo(() => {
    const { min, max } = FAIXAS_PRECO[faixa];
    return destinos.filter((d) => {
      if (mes && mesDoDestino(d.data) !== mes) return false;
      if (d.precoDesde < min || d.precoDesde > max) return false;
      if (q && !(`${d.nome} ${d.local} ${d.estado}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [destinos, q, mes, faixa]);

  return (
    <>
      <section className="relative bg-forest-deep pb-20 pt-40 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-widest text-white/70">Destinos</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-6xl">Escolha sua próxima expedição.</h1>
          <p className="mt-4 max-w-xl text-white/80">Filtre por mês de saída e faixa de preço. Vagas limitadas por saída.</p>
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
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            aria-label="Filtrar por mês"
            className="rounded-full border border-input bg-background px-4 py-2.5 text-sm"
          >
            <option value="">Todos os meses</option>
            {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={faixa}
            onChange={(e) => setFaixa(Number(e.target.value))}
            aria-label="Filtrar por faixa de preço"
            className="rounded-full border border-input bg-background px-4 py-2.5 text-sm"
          >
            {FAIXAS_PRECO.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
          </select>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => <DestinoCard key={d.slug} d={d} />)}
        </div>
        {!isLoading && list.length === 0 && <p className="py-20 text-center text-muted-foreground">Nenhuma expedição encontrada com esses filtros.</p>}
        {isLoading && <p className="py-20 text-center text-muted-foreground">Carregando expedições...</p>}
      </section>
    </>
  );
}
