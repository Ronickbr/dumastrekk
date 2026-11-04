import { Link } from "@tanstack/react-router";
import { Clock, Mountain, Thermometer, ArrowUpRight } from "lucide-react";
import type { Destino } from "@/lib/destinos";

const STATUS_STYLE: Record<Destino["status"], string> = {
  "Vagas abertas": "bg-primary/90 text-primary-foreground",
  "Últimas vagas": "bg-accent text-accent-foreground",
  "Confirmada": "bg-forest-moss text-white",
  "Esgotada": "bg-muted text-muted-foreground",
};

export function DestinoCard({ d }: { d: Destino }) {
  return (
    <Link
      to="/destinos/$slug"
      params={{ slug: d.slug }}
      className="hover-lift group relative flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border/60"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={d.imagem}
          alt={`${d.nome} — ${d.local}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[d.status]}`}>{d.status}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">{d.nivel}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-white/70">{d.local} · {d.estado}</p>
          <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight">{d.nome}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{d.duracao}</span>
          <span className="inline-flex items-center gap-1"><Mountain className="h-3.5 w-3.5" />{d.altitude}</span>
          <span className="inline-flex items-center gap-1"><Thermometer className="h-3.5 w-3.5" />{d.clima}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">desde</p>
          <p className="font-serif text-lg font-semibold text-foreground">R$ {d.precoDesde.toLocaleString("pt-BR")}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
        <span className="text-xs text-muted-foreground">{d.data}</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Reservar <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
