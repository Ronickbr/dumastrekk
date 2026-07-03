import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type CheckoutInput = {
  produtoId: string;
  quantidade: number;
  personalizacao: Record<string, string>;
  origin: string;
};

export const criarCheckoutMercadoPago = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: CheckoutInput) => {
    if (!data?.produtoId) throw new Error("produtoId obrigatório");
    const q = Number(data.quantidade || 1);
    if (!Number.isFinite(q) || q < 1) throw new Error("quantidade inválida");
    if (!data.origin || !/^https?:\/\//.test(data.origin)) throw new Error("origin inválida");
    return {
      produtoId: String(data.produtoId),
      quantidade: q,
      personalizacao: data.personalizacao ?? {},
      origin: data.origin.replace(/\/+$/, ""),
    };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: produto, error: pErr } = await supabase
      .from("produtos")
      .select("id,nome,descricao,imagem,preco,estoque,ativo,slug,personalizacao_campos")
      .eq("id", data.produtoId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!produto || !produto.ativo) throw new Error("Produto indisponível");
    if (produto.estoque < data.quantidade) throw new Error("Estoque insuficiente");

    // Valida tamanho quando o produto tem opções cadastradas
    const campos = (produto.personalizacao_campos ?? []) as Array<{ nome: string; opcoes?: string[] }>;
    const campoTamanho = campos.find((c) => c.nome === "tamanho");
    if (campoTamanho && Array.isArray(campoTamanho.opcoes) && campoTamanho.opcoes.length > 0) {
      const escolhido = data.personalizacao?.tamanho;
      if (!escolhido) throw new Error("Selecione um tamanho antes de finalizar a compra");
      if (!campoTamanho.opcoes.includes(escolhido)) throw new Error(`Tamanho inválido. Opções: ${campoTamanho.opcoes.join(", ")}`);
    }

    const preco = Number(produto.preco);
    const valorTotal = +(preco * data.quantidade).toFixed(2);

    const { data: pedido, error: oErr } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        produto_id: produto.id,
        quantidade: data.quantidade,
        personalizacao: data.personalizacao,
        valor_total: valorTotal,
        status: "pendente",
      })
      .select("id")
      .single();
    if (oErr) throw new Error(oErr.message);

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        pedidoId: pedido.id,
        init_point: null as string | null,
        error:
          "Mercado Pago ainda não configurado. Peça ao administrador para cadastrar o token MERCADO_PAGO_ACCESS_TOKEN.",
      };
    }

    const preference = {
      items: [
        {
          id: produto.id,
          title: produto.nome,
          description: produto.descricao?.slice(0, 240) ?? produto.nome,
          picture_url: produto.imagem?.startsWith("http") ? produto.imagem : undefined,
          quantity: data.quantidade,
          currency_id: "BRL",
          unit_price: preco,
        },
      ],
      external_reference: pedido.id,
      back_urls: {
        success: `${data.origin}/pedido/sucesso?pedido=${pedido.id}`,
        pending: `${data.origin}/pedido/pendente?pedido=${pedido.id}`,
        failure: `${data.origin}/pedido/falha?pedido=${pedido.id}`,
      },
      auto_return: "approved",
      metadata: {
        pedido_id: pedido.id,
        produto_slug: produto.slug,
        personalizacao: data.personalizacao,
      },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const text = await mpRes.text();
      throw new Error(`Erro Mercado Pago (${mpRes.status}): ${text.slice(0, 200)}`);
    }
    const mp = (await mpRes.json()) as { id: string; init_point: string };

    await supabase.from("pedidos").update({ mp_preference_id: mp.id }).eq("id", pedido.id);

    return { pedidoId: pedido.id, init_point: mp.init_point, error: null };
  });
