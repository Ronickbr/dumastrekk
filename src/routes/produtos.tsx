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
    ],
  }),
});

function ProdutosPage() {
  const { data: produtos = [], isLoading } = useQuery({ queryKey: produtosQueryKey, queryFn: () => fetchProdutos(false) });

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-primary">Loja Dumas</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Produtos personalizados</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Escolha o produto, personalize e pague com segurança pelo Mercado Pago.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <Link
              key={p.id}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img src={p.imagem} alt={p.nome} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h2 className="font-serif text-lg leading-tight group-hover:text-primary">{p.nome}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.descricao}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold">R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  {p.estoque > 0 ? (
                    <span className="text-xs text-primary">Personalizar →</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Esgotado</span>
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
