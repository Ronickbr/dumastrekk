import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, blogQueryKey } from "@/lib/blog";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog — Dumas Trekk" },
      { name: "description", content: "Dicas de trekking, preparação para expedições, listas de equipamentos e histórias de trilha." },
      { property: "og:title", content: "Blog — Dumas Trekk" },
      { property: "og:description", content: "Dicas de trekking, preparação para expedições e histórias de trilha." },
      { property: "og:url", content: "https://dumastrekk.lovable.app/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dumastrekk.lovable.app/blog" }],
  }),
});

function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({ queryKey: blogQueryKey, queryFn: () => fetchPosts(false) });

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-primary">Blog Dumas</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Histórias, dicas e trilhas</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Conteúdo para você se preparar melhor, escolher equipamentos e viver mais expedições.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum post publicado ainda.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.imagem} alt={p.titulo} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  <span>·</span>
                  <span>{p.autor}</span>
                </div>
                <h2 className="mt-2 font-serif text-xl leading-tight group-hover:text-primary">{p.titulo}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.resumo}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
