import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Mountain,
  ShoppingBag,
  Newspaper,
  Users,
  Calendar,
  ShoppingCart,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin · Dashboard — Dumas Trekk" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

async function fetchStats() {
  const [destinos, produtos, posts, reservas, resPendentes, pedidos, usuarios] = await Promise.all([
    supabase.from("destinos").select("*", { count: "exact", head: true }),
    supabase.from("produtos").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("reservas").select("*", { count: "exact", head: true }),
    supabase.from("reservas").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    supabase.from("pedidos").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);
  return {
    destinos: destinos.count ?? 0,
    produtos: produtos.count ?? 0,
    posts: posts.count ?? 0,
    reservas: reservas.count ?? 0,
    reservasPendentes: resPendentes.count ?? 0,
    pedidos: pedidos.count ?? 0,
    usuarios: usuarios.count ?? 0,
  };
}

async function fetchRecent() {
  const [reservas, pedidos] = await Promise.all([
    supabase
      .from("reservas")
      .select("id, destino_nome, pessoas, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("pedidos")
      .select("id, valor_total, status, quantidade, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  return { reservas: reservas.data ?? [], pedidos: pedidos.data ?? [] };
}

function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });
  const { data: recent } = useQuery({ queryKey: ["admin-recent"], queryFn: fetchRecent });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Visão geral</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas rápidas e atalhos para gerenciar o conteúdo da Dumas Trekk.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAction to="/admin/destinos" label="Novo destino" />
          <QuickAction to="/admin/produtos" label="Novo produto" />
          <QuickAction to="/admin/blog" label="Novo post" />
        </div>
      </header>

      {/* Stats grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Destinos"
          value={stats?.destinos}
          icon={<Mountain className="h-5 w-5" />}
          to="/admin/destinos"
          hint="Expedições cadastradas"
        />
        <StatCard
          label="Produtos"
          value={stats?.produtos}
          icon={<ShoppingBag className="h-5 w-5" />}
          to="/admin/produtos"
          hint="Itens na loja"
        />
        <StatCard
          label="Posts do blog"
          value={stats?.posts}
          icon={<Newspaper className="h-5 w-5" />}
          to="/admin/blog"
          hint="Publicados e rascunhos"
        />
        <StatCard
          label="Usuários"
          value={stats?.usuarios}
          icon={<Users className="h-5 w-5" />}
          to="/admin/usuarios"
          hint="Contas cadastradas"
        />
        <StatCard
          label="Reservas"
          value={stats?.reservas}
          icon={<Calendar className="h-5 w-5" />}
          highlight={
            stats?.reservasPendentes && stats.reservasPendentes > 0
              ? `${stats.reservasPendentes} pendente${stats.reservasPendentes > 1 ? "s" : ""}`
              : undefined
          }
        />
        <StatCard
          label="Pedidos"
          value={stats?.pedidos}
          icon={<ShoppingCart className="h-5 w-5" />}
          hint="Compras na loja"
        />
        <StatCard
          label="Reservas pendentes"
          value={stats?.reservasPendentes}
          icon={<TrendingUp className="h-5 w-5" />}
          hint="Aguardando confirmação"
        />
      </section>

      {/* Recent activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Últimas reservas"
          icon={<Calendar className="h-4 w-4" />}
          empty={!recent?.reservas.length}
          emptyText="Nenhuma reserva ainda."
        >
          <ul className="divide-y divide-border">
            {recent?.reservas.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.destino_nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.pessoas} pessoa{r.pessoas > 1 ? "s" : ""} ·{" "}
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Últimos pedidos"
          icon={<ShoppingCart className="h-4 w-4" />}
          empty={!recent?.pedidos.length}
          emptyText="Nenhum pedido ainda."
        >
          <ul className="divide-y divide-border">
            {recent?.pedidos.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Pedido #{p.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.quantidade} un. ·{" "}
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    R$ {Number(p.valor_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  to,
  hint,
  highlight,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  to?: "/admin/destinos" | "/admin/produtos" | "/admin/blog" | "/admin/usuarios";
  hint?: string;
  highlight?: string;
}) {
  const inner = (
    <div className="group h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        {to && (
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value ?? "—"}</p>
      {highlight ? (
        <p className="mt-1 text-xs font-medium text-primary">{highlight}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function Panel({
  title,
  icon,
  children,
  empty,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <span className="text-primary">{icon}</span> {title}
      </div>
      {empty ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pendente: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
    confirmada: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    cancelada: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
    pago: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    aguardando: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  };
  const cls = map[status] ?? "bg-muted text-foreground/70";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function QuickAction({
  to,
  label,
}: {
  to: "/admin/destinos" | "/admin/produtos" | "/admin/blog";
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2 text-xs font-medium hover:bg-muted"
    >
      <Plus className="h-3.5 w-3.5" /> {label}
    </Link>
  );
}
