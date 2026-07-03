import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, X, MapPin, Clock, Mountain, Thermometer, Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { DESTINOS } from "@/lib/destinos";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/destinos/$slug")({
  component: DestinoDetail,
  loader: ({ params }) => {
    const destino = DESTINOS.find((d) => d.slug === params.slug);
    if (!destino) throw notFound();
    return { destino };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Destino não encontrado — Dumas Trekk" }, { name: "robots", content: "noindex" }] };
    const d = loaderData.destino;
    return {
      meta: [
        { title: `${d.nome} — Dumas Trekk` },
        { name: "description", content: d.descricao },
        { property: "og:title", content: `${d.nome} — Dumas Trekk` },
        { property: "og:description", content: d.descricao },
        { property: "og:image", content: d.imagem },
        { property: "og:url", content: `/destinos/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/destinos/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60svh] items-center justify-center px-6 pt-32 text-center">
      <div>
        <h1 className="font-serif text-4xl">Destino não encontrado</h1>
        <Link to="/destinos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar aos destinos
        </Link>
      </div>
    </div>
  ),
});

function DestinoDetail() {
  const { destino: d } = Route.useLoaderData();

  return (
    <>
      {/* Hero destino */}
      <section className="relative h-[70svh] min-h-[520px] w-full overflow-hidden">
        <img src={d.imagem} alt={d.nome} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 text-white">
          <Link to="/destinos" className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur hover:bg-white/20">
            <ArrowLeft className="h-3.5 w-3.5" /> Todos os destinos
          </Link>
          <p className="inline-flex items-center gap-1 text-sm text-white/80"><MapPin className="h-4 w-4" /> {d.local} · {d.estado}, {d.pais}</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-7xl">{d.nome}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{d.descricao}</p>
        </div>
      </section>

      {/* Info + reserva */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoStat icon={<Clock />} label="Duração" value={d.duracao} />
            <InfoStat icon={<Mountain />} label="Altitude" value={d.altitude} />
            <InfoStat icon={<Thermometer />} label="Clima" value={d.clima} />
            <InfoStat icon={<Calendar />} label="Próxima saída" value={d.data} />
          </div>

          <Block title="Roteiro dia a dia">
            <ol className="space-y-6">
              {ROTEIRO.map((r, i) => (
                <li key={i} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-primary-foreground">{i + 1}</span>
                  <div>
                    <h4 className="font-serif text-lg">{r.titulo}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{r.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <div className="grid gap-8 md:grid-cols-2">
            <Block title="O que está incluso">
              <ul className="space-y-3 text-sm">
                {INCLUSO.map((t) => (
                  <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>
                ))}
              </ul>
            </Block>
            <Block title="Não incluso">
              <ul className="space-y-3 text-sm">
                {NAO_INCLUSO.map((t) => (
                  <li key={t} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{t}</li>
                ))}
              </ul>
            </Block>
          </div>

          <Block title="Equipamentos necessários">
            <div className="flex flex-wrap gap-2">
              {EQUIP.map((e) => (
                <span key={e} className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs">{e}</span>
              ))}
            </div>
          </Block>

          <Block title="Perguntas frequentes">
            <div className="divide-y divide-border">
              {FAQ.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    {f.q}<span className="text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Block>
        </div>

        {/* Sidebar reserva */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Investimento desde</p>
            <p className="mt-1 font-serif text-4xl">R$ {d.precoDesde.toLocaleString("pt-BR")}</p>
            <p className="mt-1 text-xs text-muted-foreground">por pessoa · parcelável em até 10x</p>

            <div className="mt-6 space-y-3 text-sm">
              <label className="block">
                <span className="text-xs text-muted-foreground">Data</span>
                <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2">
                  <option>{d.data}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Pessoas</span>
                <input type="number" min={1} max={12} defaultValue={1} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" />
              </label>
            </div>

            <button className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Reservar agora
            </button>
            <a
              href="https://wa.me/5511912345678"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-input py-3 text-sm font-medium hover:bg-muted"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <p className="mt-4 text-center text-xs text-muted-foreground">Pagamento seguro · PIX, cartão e parcelamento</p>
          </div>
        </aside>
      </section>
    </>
  );
}

function InfoStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-serif text-2xl md:text-3xl">{title}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
}

const ROTEIRO = [
  { titulo: "Chegada e briefing", texto: "Recepção no ponto de encontro, checagem de equipamentos e alinhamento da expedição com os guias." },
  { titulo: "Primeira trilha", texto: "Início da caminhada em ritmo confortável, com paradas técnicas e almoço na natureza." },
  { titulo: "Imersão", texto: "Dia dedicado ao contato profundo com o ambiente, fotografia e descanso." },
  { titulo: "Travessia principal", texto: "O grande dia: percurso mais desafiador com vistas inesquecíveis." },
  { titulo: "Retorno", texto: "Descida gradual, almoço de encerramento e transfer de volta." },
];
const INCLUSO = ["Guias certificados", "Refeições completas", "Hospedagem em pousadas / camping", "Transfer local", "Seguro aventura", "Kit primeiros socorros"];
const NAO_INCLUSO = ["Passagens até o ponto de encontro", "Bebidas alcoólicas", "Equipamentos pessoais", "Extras não previstos"];
const EQUIP = ["Mochila 40L", "Bota de trilha", "Capa de chuva", "Lanterna", "Roupas em camadas", "Garrafa 1L", "Protetor solar", "Chapéu"];
const FAQ = [
  { q: "Preciso ter experiência?", a: "Depende do nível da expedição. Para Fácil e Moderado, qualquer pessoa com bom condicionamento consegue participar." },
  { q: "Como funciona o cancelamento?", a: "Cancelamentos com mais de 30 dias têm reembolso integral menos taxas. Consulte a política completa." },
  { q: "Quantas pessoas por grupo?", a: "Máximo de 12 aventureiros por saída, garantindo experiência de qualidade e baixo impacto." },
  { q: "E se chover?", a: "Nossas expedições acontecem em qualquer condição climática segura. Guias avaliam o risco em tempo real." },
];
