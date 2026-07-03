import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/pedido/sucesso")({
  component: () => (
    <section className="mx-auto max-w-lg px-6 pb-20 pt-40 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
      <h1 className="mt-4 font-serif text-3xl">Pedido confirmado!</h1>
      <p className="mt-3 text-muted-foreground">
        Recebemos seu pagamento. Em breve entramos em contato para confirmar a personalização e o envio.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/produtos" className="rounded-full border border-input px-6 py-2.5 text-sm hover:bg-muted">Continuar comprando</Link>
        <Link to="/conta" className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground">Minha conta</Link>
      </div>
    </section>
  ),
  head: () => ({ meta: [{ title: "Pedido confirmado — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});
