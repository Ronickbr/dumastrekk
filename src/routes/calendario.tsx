import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowUpRight } from "lucide-react";
import { fetchDestinos, destinosQueryKey } from "@/lib/destinos";

export const Route = createFileRoute("/calendario")({
  component: CalendarioPage,
  head: () => ({
    meta: [
      { title: "Calendário de Expedições — Dumas Trekk" },
      { name: "description", content: "Confira as próximas saídas, número de vagas e status de cada expedição." },
      { property: "og:title", content: "Calendário de Expedições — Dumas Trekk" },
      { property: "og:description", content: "Confira as próximas saídas, número de vagas e status de cada expedição." },
      { property: "og:url", content: "https://dumastrekk.lovable.app/calendario" },
    ],
    links: [{ rel: "canonical", href: "https://dumastrekk.lovable.app/calendario" }],
  }),
});

const STATUS_BADGE: Record<string, string> = {
  "Vagas abertas": "bg-primary/10 text-primary",
  "Últimas vagas": "bg-accent/15 text-accent",
  "Confirmada": "bg-forest-moss/15 text-forest-moss",
  "Esgotada": "bg-muted text-muted-foreground",
};

function CalendarioPage() {
  const { data: destinos = [] } = useQuery({ queryKey: destinosQueryKey, queryFn: fetchDestinos });
  return (
    <>
      <section className="relative bg-forest-deep pb-20 pt-40 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="max-w-3xl font-serif text-5xl md:text-6xl leading-tight">Próximas saídas & vagas disponíveis</h1>
          <p className="mt-4 max-w-xl text-white/80">Reserve com antecedência — nossos grupos têm no máximo 12 pessoas.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Expedição</th>
                <th className="px-6 py-4 hidden md:table-cell">Duração</th>
                <th className="px-6 py-4 hidden md:table-cell">Vagas</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {destinos.map((d, i) => (
                <tr key={d.slug} className="hover:bg-secondary/30">
                  <td className="px-6 py-5 font-medium">
                    <div className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{d.data}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-serif text-base">{d.nome}</div>
                    <div className="text-xs text-muted-foreground">{d.local} · {d.estado}</div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">{d.duracao}</td>
                  <td className="px-6 py-5 hidden md:table-cell">{[3, 2, 6, 8][i % 4]} / 12</td>
                  <td className="px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to="/destinos/$slug" params={{ slug: d.slug }} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Reservar <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
