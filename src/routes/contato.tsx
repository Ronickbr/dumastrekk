import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Phone, Instagram } from "lucide-react";

export const Route = createFileRoute("/contato")({
  component: ContatoPage,
  head: () => ({
    meta: [
      { title: "Contato — Dumas Trekk" },
      { name: "description", content: "Fale com nosso time. WhatsApp, e-mail, telefone e Instagram." },
      { property: "og:title", content: "Contato — Dumas Trekk" },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
});

function ContatoPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-40 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Contato</p>
        <h1 className="mt-2 font-serif text-5xl md:text-6xl">Vamos planejar sua próxima aventura.</h1>
        <p className="mt-6 max-w-lg text-muted-foreground">
          Responda algumas perguntas e nossa equipe entra em contato em até 24h com um roteiro personalizado.
        </p>
        <div className="mt-10 space-y-4">
          <a href="https://wa.me/5511912345678" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]"><MessageCircle className="h-5 w-5" /></div>
            <div><p className="font-medium">WhatsApp</p><p className="text-sm text-muted-foreground">+55 (11) 91234-5678</p></div>
          </a>
          <a href="mailto:contato@dumastrekk.com.br" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail className="h-5 w-5" /></div>
            <div><p className="font-medium">E-mail</p><p className="text-sm text-muted-foreground">contato@dumastrekk.com.br</p></div>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent"><Phone className="h-5 w-5" /></div>
            <div><p className="font-medium">Telefone</p><p className="text-sm text-muted-foreground">+55 (11) 3456-7890</p></div>
          </div>
          <a href="https://www.instagram.com/dumastrekk/" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Instagram className="h-5 w-5" /></div>
            <div><p className="font-medium">Instagram</p><p className="text-sm text-muted-foreground">@dumastrekk</p></div>
          </a>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="grid gap-4">
          <label className="block text-sm">
            <span className="text-muted-foreground">Nome</span>
            <input required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">E-mail</span>
              <input required type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">WhatsApp</span>
              <input required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-muted-foreground">Qual destino te interessa?</span>
            <input className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Sua mensagem</span>
            <textarea rows={4} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button className="mt-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Solicitar orçamento
          </button>
        </div>
      </form>
    </section>
  );
}
