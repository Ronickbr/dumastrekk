import { createFileRoute } from "@tanstack/react-router";
import { Leaf, TreePine, Recycle, HandHeart } from "lucide-react";

export const Route = createFileRoute("/sustentabilidade")({
  component: SustPage,
  head: () => ({
    meta: [
      { title: "Sustentabilidade — Dumas Trekk" },
      { name: "description", content: "Práticas ambientais, turismo responsável, compensação de carbono e projetos sociais." },
      { property: "og:title", content: "Sustentabilidade — Dumas Trekk" },
      { property: "og:url", content: "/sustentabilidade" },
      { property: "og:image", content: "/images/sustentabilidade.jpg" },
    ],
    links: [{ rel: "canonical", href: "/sustentabilidade" }],
  }),
});

function SustPage() {
  return (
    <>
      <section className="relative h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src="/images/sustentabilidade.jpg" alt="Plantio de mudas nativas" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 text-white">
          <p className="text-xs uppercase tracking-widest text-white/80">Compromisso ambiental</p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-7xl">A montanha é nossa casa. E cuidamos dela.</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-24 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Leaf />, t: "Baixo impacto", d: "Grupos pequenos e princípios de mínimo impacto em cada trilha." },
          { icon: <TreePine />, t: "Compensação de carbono", d: "100% das emissões das expedições são compensadas com plantio nativo." },
          { icon: <Recycle />, t: "Resíduo zero", d: "Trazemos de volta todo resíduo gerado. Zero lixo no caminho." },
          { icon: <HandHeart />, t: "Comunidades locais", d: "Parcerias diretas com produtores, guias e pousadas regionais." },
        ].map((x) => (
          <div key={x.t} className="rounded-3xl border border-border bg-card p-8">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">{x.icon}</div>
            <h3 className="mt-5 font-serif text-2xl">{x.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
