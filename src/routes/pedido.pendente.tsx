import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/pedido/pendente")({
  component: () => (
    <section className="mx-auto max-w-lg px-6 pb-20 pt-40 text-center">
      <Clock className="mx-auto h-14 w-14 text-primary" />
      <h1 className="mt-4 font-serif text-3xl">Pagamento pendente</h1>
      <p className="mt-3 text-muted-foreground">
        Estamos aguardando a confirmação do Mercado Pago. Assim que aprovado, você recebe um e-mail.
      </p>
      <Link to="/conta" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground">Minha conta</Link>
    </section>
  ),
  head: () => ({ meta: [{ title: "Pagamento pendente — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});
