import { createFileRoute, Link } from "@tanstack/react-router";
import { Mountain, Compass, Tent, MapPin, ArrowRight, Instagram, Twitter, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <Mountain className="h-6 w-6 text-primary" />
            <span>Vertente</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#destinos" className="text-muted-foreground transition-colors hover:text-foreground">
              Destinos
            </a>
            <a href="#sobre" className="text-muted-foreground transition-colors hover:text-foreground">
              Sobre
            </a>
            <a href="#contato" className="text-muted-foreground transition-colors hover:text-foreground">
              Contato
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-adventure.jpg"
            alt="Paisagem montanhosa ao pôr do sol com um aventureiro em uma trilha"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-background" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-end px-6 pb-20 pt-40 md:pt-56 lg:pt-72">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5" />
            Explore o desconhecido
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Aventuras que transformam
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/80 md:text-lg">
            Descubra trilhas, montanhas e paisagens de tirar o fôlego. Cada jornada começa com um primeiro passo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#destinos"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver destinos
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Saiba mais
            </a>
          </div>
        </div>
      </section>

      {/* Destinos */}
      <section id="destinos" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Destinos em destaque</h2>
          <p className="mt-3 text-muted-foreground">Escolha sua próxima aventura entre destinos incríveis</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DestinationCard
            title="Trilha dos Picos"
            location="Serra da Mantiqueira, MG"
            description="Uma trilha desafiadora com vistas panorâmicas de picos acima de 2.000m."
            icon={<Mountain className="h-5 w-5" />}
          />
          <DestinationCard
            title="Vale das Cachoeiras"
            location="Chapada Diamantina, BA"
            description="Caminhadas entre cânions, cachoeiras e piscinas naturais de águas cristalinas."
            icon={<MapPin className="h-5 w-5" />}
          />
          <DestinationCard
            title="Acampamento nas Estrelas"
            location="Serra do Cipó, MG"
            description="Noites de acampamento sob um céu repleto de estrelas no alto da serra."
            icon={<Tent className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Sobre a Vertente</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Nascemos da paixão por explorar o mundo natural. Conectamos aventureiros a experiências autênticas
                em meio à natureza — desde trilhas leves até expedições em alta montanha.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Nosso compromisso é com o turismo responsável e a preservação dos ambientes que visitamos.
                Cada aventura é planejada com respeito às comunidades locais e aos ecossistemas.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <Stat number="120+" label="Trilhas" />
                <Stat number="15k+" label="Aventureiros" />
                <Stat number="4.9" label="Avaliação" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=600&fit=crop"
                    alt="Acampamento em uma floresta"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop"
                    alt="Vista panorâmica de montanhas"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center md:px-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-primary-foreground" />
            </svg>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Pronto para sua próxima aventura?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
              Junte-se a milhares de exploradores e descubra destinos que vão mudar sua perspectiva do mundo.
            </p>
            <a
              href="#contato"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 font-bold text-lg text-foreground">
              <Mountain className="h-5 w-5 text-primary" />
              <span>Vertente</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Vertente Aventuras. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DestinationCard({
  title,
  location,
  description,
  icon,
}: {
  title: string;
  location: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {location}
      </p>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
      >
        Explorar
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-foreground">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
