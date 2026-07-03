import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, Leaf, ShieldCheck, Users, Star, Play, Instagram } from "lucide-react";
import { fetchDestinos, destinosQueryKey } from "@/lib/destinos";
import { DestinoCard } from "@/components/DestinoCard";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Dumas Trekk — Explore lugares que transformam vidas" },
      { name: "description", content: "Expedições de trekking, ecoturismo e aventura com segurança e propósito. Reserve sua próxima experiência com a Dumas Trekk." },
      { property: "og:title", content: "Dumas Trekk — Explore lugares que transformam vidas" },
      { property: "og:description", content: "Trekking, ecoturismo e aventuras cuidadosamente planejadas." },
      { property: "og:image", content: "/images/hero-dumas.jpg" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: "/images/hero-dumas.jpg", fetchpriority: "high" },
    ],
  }),
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src="/images/hero-dumas.jpg"
          alt="Aventureiro em cume de montanha ao amanhecer"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:pb-28">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">
            <Compass className="h-3.5 w-3.5" /> Expedições autorais desde 2015
          </span>
          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Explore lugares que transformam vidas.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 md:text-xl">
            Trekking, ecoturismo e aventuras cuidadosamente planejadas — guiadas por quem vive a montanha.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/destinos"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground shadow-lg transition-transform hover:scale-105"
            >
              Reservar agora <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/calendario"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10"
            >
              <Play className="h-4 w-4" /> Ver próximos destinos
            </Link>
          </div>
        </div>
        {/* Faixa de destaque na base */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/30 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-5 text-white md:grid-cols-4">
            <Stat n="+120" label="Expedições realizadas" />
            <Stat n="+2.400" label="Aventureiros guiados" />
            <Stat n="15" label="Guias certificados" />
            <Stat n="4.9★" label="Avaliação média" />
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-3">
          <Pillar icon={<ShieldCheck />} title="Segurança que liberta" text="Guias certificados, planejamento minucioso e equipamentos revisados. Você foca em viver a experiência." />
          <Pillar icon={<Leaf />} title="Baixo impacto, alto propósito" text="Turismo responsável, compensação de carbono e parcerias com comunidades locais em cada roteiro." />
          <Pillar icon={<Users />} title="Grupos pequenos, conexões reais" text="Máximo de 12 pessoas por expedição. Menos ruído, mais floresta, e amizades que duram." />
        </div>
      </section>

      {/* DESTINOS EM DESTAQUE */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Próximas expedições</p>
              <h2 className="mt-2 max-w-2xl font-serif text-4xl md:text-5xl">Destinos que marcam para sempre</h2>
            </div>
            <Link to="/destinos" className="group inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ver todos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINOS.map((d) => <DestinoCard key={d.slug} d={d} />)}
          </div>
        </div>
      </section>

      {/* SOBRE / MANIFESTO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="relative overflow-hidden rounded-3xl">
          <img src="/images/sobre-equipe.jpg" alt="Guias Dumas Trekk em briefing" loading="lazy" className="aspect-[5/4] w-full object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">A Dumas Trekk</p>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl">Aventura com raiz, cuidado e propósito.</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Nascemos da vontade de mostrar que aventura de verdade é feita com respeito. Cada expedição é planejada por
            quem conhece o terreno, valoriza o local e caminha lado a lado com você.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              "Guias com formação técnica e primeiros socorros",
              "Roteiros construídos com comunidades locais",
              "Compensação de carbono em 100% das saídas",
              "Suporte 24/7 durante a expedição",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />{t}
              </li>
            ))}
          </ul>
          <Link to="/sobre" className="mt-10 inline-flex items-center gap-2 rounded-full border border-input px-6 py-3 text-sm font-medium hover:bg-muted">
            Conheça nossa história <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="bg-forest-deep py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-widest text-white/60">Depoimentos</p>
          <h2 className="mt-2 max-w-3xl font-serif text-4xl md:text-5xl">Histórias que nossos aventureiros levam para casa.</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <blockquote key={i} className="glass-dark rounded-3xl p-8">
                <div className="flex text-accent">{[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-4 text-white/90">"{t.quote}"</p>
                <footer className="mt-6 text-sm text-white/70">— {t.name}, {t.trip}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-forest-deep via-primary to-forest-moss p-10 text-white md:p-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">Instagram</p>
              <h2 className="mt-2 font-serif text-4xl md:text-5xl">Acompanhe cada passo em @dumastrekk</h2>
              <p className="mt-4 max-w-lg text-white/85">Reels, bastidores e as próximas saídas em primeira mão.</p>
              <a href="https://www.instagram.com/dumastrekk/" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground hover:scale-105 transition-transform">
                <Instagram className="h-4 w-4" /> Seguir no Instagram
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                "/images/destino-chapada.jpg",
                "/images/destino-pico.jpg",
                "/images/destino-cachoeira.jpg",
                "/images/destino-acampamento.jpg",
                "/images/sobre-equipe.jpg",
                "/images/sustentabilidade.jpg",
              ].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl">
                  <img src={src} alt="Feed" loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl md:text-3xl">{n}</p>
      <p className="text-xs uppercase tracking-widest text-white/70">{label}</p>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-6 font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

const TESTIMONIALS = [
  { quote: "Voltei outra pessoa. A organização foi impecável e os guias transmitiam segurança em todos os momentos.", name: "Marina P.", trip: "Vale do Pati" },
  { quote: "A Dumas cuida de cada detalhe. Pude focar 100% na experiência e nas amizades que fiz na trilha.", name: "Rafael G.", trip: "Serra do Cipó" },
  { quote: "Superou todas as expectativas. Vou levar essa expedição no coração para sempre.", name: "Juliana M.", trip: "Pico da Neblina" },
];
