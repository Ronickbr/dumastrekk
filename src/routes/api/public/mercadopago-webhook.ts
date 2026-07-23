import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Mercado Pago envia notificações IPN/Webhook para este endpoint.
// Segurança:
// 1) Se MERCADO_PAGO_WEBHOOK_SECRET estiver configurado, validamos o header
//    `x-signature` (formato: "ts=...,v1=...") conforme a doc do MP.
// 2) SEMPRE re-consultamos o pagamento na API do MP com o access token
//    do servidor — é a fonte da verdade; o corpo do webhook nunca é confiado.
// 3) Só marcamos pedido como pago quando o MP retorna status=approved
//    e a preferência bate com o pedido armazenado.

function verifyMpSignature(params: {
  secret: string;
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string;
}): boolean {
  const { secret, signatureHeader, requestId, dataId } = params;
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    }),
  ) as Record<string, string | undefined>;
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;
  const manifest = `id:${dataId};request-id:${requestId ?? ""};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function processPayment(paymentId: string, accessToken: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    console.error("[mp-webhook] falha ao consultar pagamento", res.status);
    return { ok: false as const };
  }
  const payment = (await res.json()) as {
    id: number | string;
    status: string;
    external_reference?: string | null;
    preference_id?: string | null;
    order?: { id?: string } | null;
  };

  const pedidoId = payment.external_reference;
  if (!pedidoId) {
    console.warn("[mp-webhook] pagamento sem external_reference", payment.id);
    return { ok: false as const };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Confere se o pedido existe e casa com a preferência gravada.
  const { data: pedido, error: pErr } = await supabaseAdmin
    .from("pedidos")
    .select("id, status, mp_preference_id")
    .eq("id", pedidoId)
    .maybeSingle();
  if (pErr || !pedido) {
    console.warn("[mp-webhook] pedido não encontrado", pedidoId, pErr?.message);
    return { ok: false as const };
  }
  if (
    pedido.mp_preference_id &&
    payment.preference_id &&
    pedido.mp_preference_id !== payment.preference_id
  ) {
    console.warn("[mp-webhook] preference_id não bate", pedidoId);
    return { ok: false as const };
  }

  const novoStatus =
    payment.status === "approved"
      ? "pago"
      : payment.status === "in_process" || payment.status === "pending"
        ? "pendente"
        : payment.status === "rejected" || payment.status === "cancelled"
          ? "falha"
          : pedido.status;

  const { error: uErr } = await supabaseAdmin
    .from("pedidos")
    .update({
      status: novoStatus,
      mp_payment_id: String(payment.id),
    })
    .eq("id", pedidoId);
  if (uErr) {
    console.error("[mp-webhook] falha ao atualizar pedido", uErr.message);
    return { ok: false as const };
  }
  return { ok: true as const };
}

export const Route = createFileRoute("/api/public/mercadopago-webhook")({
  server: {
    handlers: {
      GET: async () => new Response("ok", { status: 200 }),
      POST: async ({ request }) => {
        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!accessToken) {
          console.error("[mp-webhook] MERCADO_PAGO_ACCESS_TOKEN ausente");
          return new Response("Config missing", { status: 500 });
        }

        const url = new URL(request.url);
        const rawBody = await request.text();
        let body: any = {};
        try {
          body = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          body = {};
        }

        // Descobre o payment id a partir do payload ou da querystring
        const dataId: string | undefined =
          body?.data?.id?.toString() ??
          url.searchParams.get("data.id") ??
          url.searchParams.get("id") ??
          undefined;
        const topic: string | undefined =
          body?.type ??
          body?.topic ??
          url.searchParams.get("type") ??
          url.searchParams.get("topic") ??
          undefined;

        if (!dataId) {
          // Notificações sem id (ex: merchant_order) — responder 200 para o MP não reenviar.
          return new Response("ignored", { status: 200 });
        }

        // Validação opcional de assinatura (recomendada).
        const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
        if (secret) {
          const ok = verifyMpSignature({
            secret,
            signatureHeader: request.headers.get("x-signature"),
            requestId: request.headers.get("x-request-id"),
            dataId,
          });
          if (!ok) {
            console.warn("[mp-webhook] assinatura inválida");
            return new Response("Invalid signature", { status: 401 });
          }
        }

        // Só processa notificações de pagamento; ignora as demais silenciosamente.
        if (topic && topic !== "payment") {
          return new Response("ignored", { status: 200 });
        }

        const result = await processPayment(dataId, accessToken);
        // Sempre 200 quando o pagamento foi consultado — evita reenvios em loop.
        // Erros persistentes ficam nos logs para investigação.
        return new Response(result.ok ? "ok" : "processed", { status: 200 });
      },
    },
  },
});
