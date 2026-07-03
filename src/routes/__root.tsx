import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Moon, Sun, MessageCircle, Instagram, Mail, Phone, MapPin, UserRound } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A trilha que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo saiu da trilha</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte ao início.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dumas Trekk — Expedições de trekking e ecoturismo" },
      { name: "description", content: "Trekking, montanhismo e expedições cuidadosamente planejadas. Explore lugares que transformam vidas com guias certificados." },
      { name: "author", content: "Dumas Trekk" },
      { property: "og:title", content: "Dumas Trekk — Expedições de trekking e ecoturismo" },
      { property: "og:description", content: "Trekking, montanhismo e expedições cuidadosamente planejadas. Explore lugares que transformam vidas com guias certificados." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dumas Trekk" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dumas Trekk — Expedições de trekking e ecoturismo" },
      { name: "twitter:description", content: "Trekking, montanhismo e expedições cuidadosamente planejadas. Explore lugares que transformam vidas com guias certificados." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Dumas Trekk",
          url: "https://dumastrekk.lovable.app",
          logo: "https://dumastrekk.lovable.app/logo-dumas.png",
          sameAs: ["https://instagram.com/dumastrekk"],
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo-dumas.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body className="overflow-x-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Início" },
  { to: "/destinos", label: "Destinos" },
  { to: "/calendario", label: "Calendário" },
  { to: "/produtos", label: "Loja" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

function Navbar() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const hasDarkHero = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const solid = scrolled || !hasDarkHero;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setSignedIn(!!session);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("dumas-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dumas-theme", next ? "dark" : "light");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Dumas Trekk — Início" className="flex items-center">
          <img src="/logo-dumas.png" alt="Dumas Trekk — Turismo de Aventura" className={`h-14 w-14 object-contain transition-all ${scrolled ? "" : "drop-shadow-lg"}`} />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className={`transition-colors ${scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/90 hover:text-white drop-shadow"}`}
              activeProps={{ className: scrolled ? "text-primary" : "text-white font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className={`hidden rounded-full p-2 transition-colors md:inline-flex ${scrolled ? "hover:bg-muted" : "text-white hover:bg-white/10"}`}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {signedIn ? (
            <Link
              to="/conta"
              className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium md:inline-flex ${scrolled ? "border border-input hover:bg-muted" : "border border-white/40 text-white hover:bg-white/10"}`}
            >
              <UserRound className="h-4 w-4" /> Minha conta
            </Link>
          ) : (
            <Link
              to="/auth"
              className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium md:inline-flex ${scrolled ? "border border-input hover:bg-muted" : "border border-white/40 text-white hover:bg-white/10"}`}
            >
              Entrar
            </Link>
          )}
          <Link
            to="/destinos"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105 md:inline-flex"
          >
            Reservar
          </Link>
          <button
            className={`inline-flex rounded-md p-2 lg:hidden ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="glass border-t border-border/40 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                {n.label}
              </Link>
            ))}
            <Link to={signedIn ? "/conta" : "/auth"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
              {signedIn ? "Minha conta" : "Entrar / Cadastrar"}
            </Link>
            <button onClick={toggleTheme} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {dark ? "Modo claro" : "Modo escuro"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link to="/" aria-label="Dumas Trekk — Início" className="inline-flex items-center">
            <img src="/logo-dumas.png" alt="Dumas Trekk — Turismo de Aventura" className="h-20 w-20 object-contain" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Expedições de trekking, ecoturismo e aventura com segurança, propósito e respeito à natureza.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-base font-semibold">Navegue</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-foreground">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-base font-semibold">Contato</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +55 (11) 91234-5678</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@dumastrekk.com.br</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> São Paulo — Brasil</li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              <a href="https://www.instagram.com/dumastrekk/" target="_blank" rel="noreferrer" className="hover:text-foreground">@dumastrekk</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-base font-semibold">Newsletter</h4>
          <p className="mt-4 text-sm text-muted-foreground">Receba novas expedições e promoções.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
            <input type="email" required placeholder="seu@email.com" className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary" />
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">OK</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Dumas Trekk. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Política de cancelamento</a>
            <a href="#" className="hover:text-foreground">Termos</a>
            <a href="#" className="hover:text-foreground">LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5511912345678?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20expedi%C3%A7%C3%B5es%20da%20Dumas%20Trekk."
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

