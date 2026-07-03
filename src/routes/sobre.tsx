import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Leaf, Users } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => ({
    meta: [
      { title: "Sobre a Dumas Trekk" },
      { name: "description", content: "Nossa história, missão, valores e equipe de guias certificados." },
      { property: "og:title", content: "Sobre a Dumas Trekk" },
      { property: "og:description", content: "Nossa história, missão, valores e equipe de guias certificados." },
      { property: "og:url", content: "https://dumastrekk.lovable.app/sobre" },
      { property: "og:image", content: "https://dumastrekk.lovable.app/images/sobre-equipe.jpg" },
      { name: "twitter:image", content: "https://dumastrekk.lovable.app/images/sobre-equipe.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://dumastrekk.lovable.app/sobre" }],
  }),
});

function SobrePage() {
  return (
    <>
      <section className="relative h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src="/images/sobre-equipe.jpg" alt="Equipe Dumas Trekk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 text-white">
          <p className="text-xs uppercase tracking-widest text-white/80">Sobre nós</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-7xl">Nascemos para tirar você da rotina — com segurança e propósito.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-lg leading-relaxed text-foreground/90">
        <p>
          A Dumas Trekk nasceu da paixão de um pequeno grupo de aventureiros que acreditavam que viajar poderia ser mais
          do que visitar lugares — poderia ser um encontro com a natureza, com o outro e consigo mesmo.
        </p>
        <p className="mt-6">
          Hoje, somos referência em expedições autorais no Brasil e na América do Sul, guiando pessoas por trilhas,
          montanhas, cachoeiras e paisagens que transformam.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: <Heart />, t: "Missão", d: "Conectar pessoas à natureza através de experiências transformadoras." },
            { icon: <Leaf />, t: "Valores", d: "Respeito, segurança, sustentabilidade e verdade em cada roteiro." },
            { icon: <Users />, t: "Equipe", d: "15 guias certificados em condução, resgate e primeiros socorros." },
            { icon: <Award />, t: "Reconhecimento", d: "Prêmio ABETA de melhor operadora de aventura 2024." },
          ].map((x) => (
            <div key={x.t} className="rounded-3xl border border-border bg-card p-8">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">{x.icon}</div>
              <h3 className="mt-5 font-serif text-2xl">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
