import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Mountain,
  ShoppingBag,
  Newspaper,
  Users,
  ShieldAlert,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Painel administrativo — Dumas Trekk" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/destinos", label: "Destinos", icon: Mountain, exact: false },
  { to: "/admin/produtos", label: "Produtos", icon: ShoppingBag, exact: false },
  { to: "/admin/blog", label: "Blog", icon: Newspaper, exact: false },
  { to: "/admin/usuarios", label: "Usuários", icon: Users, exact: false },
] as const;

function AdminLayout() {
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean }>({
    loading: true,
    isAdmin: false,
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setState({ loading: false, isAdmin: false });
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setState({ loading: false, isAdmin: !!data });
    })();
  }, []);

  if (state.loading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center pt-32 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando permissões...
      </div>
    );
  }

  if (!state.isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-6 pb-20 pt-40 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-serif text-3xl">Acesso restrito</h1>
        <p className="mt-2 text-muted-foreground">
          Esta área é exclusiva para administradores. Peça a um administrador para atribuir o papel
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">admin</code> à sua conta.
        </p>
        <Link
          to="/conta"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para minha conta
        </Link>
      </section>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-muted/20 pt-24">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:pt-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Painel
              </p>
              <p className="font-serif text-lg">Administração</p>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                      (active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <Link
                to="/conta"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Minha conta
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="fixed inset-x-0 top-20 z-40 border-b border-border bg-background/95 backdrop-blur lg:hidden">
          <nav className="scrollbar-none flex gap-1 overflow-x-auto px-4 py-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium " +
                    (active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-foreground/70 hover:bg-muted")
                  }
                >
                  <Icon className="h-3.5 w-3.5" /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <main className="min-w-0 flex-1 pt-14 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
