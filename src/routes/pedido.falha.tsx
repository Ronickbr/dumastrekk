import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/pedido/falha")({
  component: () => (
    <section className="mx-auto max-w-lg px-6 pb-20 pt-40 text-center">
      <XCircle className="mx-auto h-14 w-14 text-destructive" />
      <h1 className="mt-4 font-serif text-3xl">Pagamento não concluído</h1>
      <p className="mt-3 text-muted-foreground">Algo deu errado no pagamento. Você pode tentar novamente ou escolher outra forma.</p>
      <Link to="/produtos" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground">Voltar à loja</Link>
    </section>
  ),
  head: () => ({ meta: [{ title: "Pagamento não concluído — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});
