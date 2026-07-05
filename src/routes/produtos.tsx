import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProdutos, produtosQueryKey } from "@/lib/produtos";

export const Route = createFileRoute("/produtos")({
  component: ProdutosPage,
  head: () => ({
    meta: [
      { title: "Loja — Produtos personalizados Dumas Trekk" },
      { name: "description", content: "Camisetas, canecas e itens personalizados para você levar a Dumas Trekk na trilha." },
      { property: "og:title", content: "Loja — Produtos personalizados Dumas Trekk" },
      { property: "og:description", content: "Camisetas, canecas e itens personalizados para trilheiros." },
      { property: "og:url", content: "https://dumastrekk.lovable.app/produtos" },
    ],
    links: [{ rel: "canonical", href: "https://dumastrekk.lovable.app/produtos" }],
  }),
});

function ProdutosPage() {
  const { data: produtos = [], isLoading } = useQuery({ queryKey: produtosQueryKey, queryFn: () => fetchProdutos(false) });

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <div className="mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Loja Dumas</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-balance md:text-6xl">Vista a expedição.</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Produtos oficiais com a logo Dumas Trekk — feitos para durar tanto quanto suas memórias na trilha.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-3xl bg-card ring-1 ring-border/60">
              <div className="aspect-square bg-muted" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-5 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <Link
              key={p.id}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              className="hover-lift group relative flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border/60"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={p.imagem}
                  alt={p.nome}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {p.estoque === 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-foreground/85 px-3 py-1 text-xs font-medium text-background backdrop-blur">
                    Esgotado
                  </span>
                )}
                {p.estoque > 0 && p.estoque <= 5 && (
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Últimas unidades
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="font-serif text-xl leading-tight transition-colors group-hover:text-primary">{p.nome}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{p.descricao}</p>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">a partir de</p>
                    <p className="font-serif text-xl font-semibold">R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  </div>
                  {p.estoque > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                      Comprar →
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
