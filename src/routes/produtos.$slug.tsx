import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchProdutoBySlug } from "@/lib/produtos";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { criarCheckoutMercadoPago } from "@/lib/checkout.functions";

export const Route = createFileRoute("/produtos/$slug")({
  component: ProdutoDetalhe,
  loader: async ({ params }) => {
    const produto = await fetchProdutoBySlug(params.slug);
    if (!produto) throw notFound();
    return { produto };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Produto não encontrado — Dumas Trekk" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.produto;
    const url = `https://dumastrekk.lovable.app/produtos/${params.slug}`;
    return {
      meta: [
        { title: `${p.nome} — Loja Dumas Trekk` },
        { name: "description", content: p.descricao },
        { property: "og:title", content: p.nome },
        { property: "og:description", content: p.descricao },
        { property: "og:image", content: p.imagem },
        { name: "twitter:image", content: p.imagem },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(p.ativo ? [] : [{ name: "robots", content: "noindex" } as const]),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.nome,
          description: p.descricao,
          image: p.imagem,
          url,
          offers: {
            "@type": "Offer",
            price: p.preco,
            priceCurrency: "BRL",
            availability: p.estoque > 0 && p.ativo ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url,
          },
        }),
      }],
    };
  },
});

function tamanhoOpcoes(p: { personalizacao_campos: Array<{ nome: string; opcoes?: string[] }> }): string[] {
  const c = p.personalizacao_campos.find((x) => x.nome === "tamanho");
  return c?.opcoes ?? [];
}

function ProdutoDetalhe() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const checkout = useServerFn(criarCheckoutMercadoPago);
  const { data: produto, isLoading } = useQuery({
    queryKey: ["produto", slug],
    queryFn: () => fetchProdutoBySlug(slug),
  });
  const [tamanho, setTamanho] = useState<string>("");
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);

  if (isLoading) return <p className="pt-40 text-center text-muted-foreground">Carregando...</p>;
  if (!produto || !produto.ativo) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-40 text-center">
        <h1 className="font-serif text-3xl">Produto não disponível</h1>
        <Link to="/produtos" className="mt-6 inline-flex text-primary hover:underline">← Voltar à loja</Link>
      </div>
    );
  }

  const handleBuy = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.info("Entre para finalizar a compra");
      navigate({ to: "/auth" });
      return;
    }
    const tamanhos = tamanhoOpcoes(produto);
    if (tamanhos.length > 0 && !tamanho) {
      toast.error("Selecione o tamanho");
      return;
    }
    setLoading(true);
    try {
      const res = await checkout({
        data: {
          produtoId: produto.id,
          quantidade,
          personalizacao: tamanho ? { tamanho } : {},
          origin: window.location.origin,
        },
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.init_point) {
        window.location.href = res.init_point;
      }
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao iniciar checkout");
    } finally {
      setLoading(false);
    }
  };

  const total = produto.preco * quantidade;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <Link to="/produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Loja
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-cover" />
        </div>

        <div>
          <h1 className="font-serif text-4xl">{produto.nome}</h1>
          <p className="mt-3 text-muted-foreground">{produto.descricao}</p>
          <p className="mt-6 text-3xl font-semibold">
            R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {produto.estoque > 0 ? `${produto.estoque} em estoque` : "Esgotado"}
          </p>

          <div className="mt-8 space-y-4">
            {tamanhoOpcoes(produto).length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Tamanho</label>
                <div className="flex flex-wrap gap-2">
                  {tamanhoOpcoes(produto).map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setTamanho(o)}
                      className={`rounded-full border px-4 py-2 text-sm ${tamanho === o ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}


            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Quantidade</label>
              <input
                type="number"
                min={1}
                max={produto.estoque || 1}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Math.min(produto.estoque, Number(e.target.value) || 1)))}
                className="w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Resumo do pedido</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Produto</span><span className="font-medium">{produto.nome}</span></div>
              {tamanhoOpcoes(produto).length > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Tamanho</span><span className="font-medium">{tamanho || "—"}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Quantidade</span><span className="font-medium">{quantidade}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Preço unitário</span><span className="font-medium">R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-semibold">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <button
              disabled={loading || produto.estoque < 1 || (tamanhoOpcoes(produto).length > 0 && !tamanho)}
              onClick={handleBuy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Preparando checkout..." : "Comprar com Mercado Pago"}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Pagamento seguro via Mercado Pago · Pix, cartão ou boleto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
