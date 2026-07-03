import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  head: () => ({ meta: [{ title: "Produto — Dumas Trekk" }] }),
});

function ProdutoDetalhe() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const checkout = useServerFn(criarCheckoutMercadoPago);
  const { data: produto, isLoading } = useQuery({
    queryKey: ["produto", slug],
    queryFn: () => fetchProdutoBySlug(slug),
  });
  const [personalizacao, setPersonalizacao] = useState<Record<string, string>>({});
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
    // valida campos obrigatórios
    for (const campo of produto.personalizacao_campos) {
      if (campo.tipo === "select" && !personalizacao[campo.nome]) {
        toast.error(`Selecione ${campo.label}`);
        return;
      }
    }
    setLoading(true);
    try {
      const res = await checkout({
        data: {
          produtoId: produto.id,
          quantidade,
          personalizacao,
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
            {produto.personalizacao_campos.map((campo) => (
              <div key={campo.nome}>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{campo.label}</label>
                {campo.tipo === "select" ? (
                  <select
                    value={personalizacao[campo.nome] ?? ""}
                    onChange={(e) => setPersonalizacao({ ...personalizacao, [campo.nome]: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Selecione...</option>
                    {campo.opcoes?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={personalizacao[campo.nome] ?? ""}
                    onChange={(e) => setPersonalizacao({ ...personalizacao, [campo.nome]: e.target.value })}
                    placeholder={`Digite ${campo.label.toLowerCase()}`}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}

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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-semibold">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <button
              disabled={loading || produto.estoque < 1}
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
