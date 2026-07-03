import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, User, LogOut, Trash2, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Dumas Trekk" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContaPage,
});

type Profile = {
  nome: string | null;
  telefone: string | null;
  cidade: string | null;
  contato_emergencia: string | null;
  avatar_url: string | null;
};

type Reserva = {
  id: string;
  destino_nome: string;
  destino_slug: string;
  data_expedicao: string | null;
  pessoas: number;
  status: string;
  observacoes: string | null;
  created_at: string;
};

function ContaPage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [tab, setTab] = useState<"reservas" | "perfil">("reservas");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [profile, setProfile] = useState<Profile>({
    nome: "", telefone: "", cidade: "", contato_emergencia: "", avatar_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("nome,telefone,cidade,contato_emergencia,avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("reservas").select("*").order("created_at", { ascending: false }),
      ]);
      if (p) setProfile(p as Profile);
      if (r) setReservas(r as Reserva[]);
      setLoading(false);
    })();
  }, [user.id]);

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error("Não foi possível salvar");
    toast.success("Perfil atualizado!");
  };

  const onCancelReserva = async (id: string) => {
    if (!confirm("Deseja cancelar esta reserva?")) return;
    const { error } = await supabase.from("reservas").delete().eq("id", id);
    if (error) return toast.error("Erro ao cancelar");
    setReservas((rs) => rs.filter((r) => r.id !== id));
    toast.success("Reserva cancelada");
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Minha conta</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">Olá, {profile.nome || user.email?.split("@")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      <div className="mt-8 flex gap-1 border-b border-border">
        {([
          { id: "reservas", label: "Minhas reservas", icon: CalendarDays },
          { id: "perfil", label: "Perfil", icon: User },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : tab === "reservas" ? (
          reservas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">Você ainda não tem reservas.</p>
              <a href="/destinos" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Ver expedições
              </a>
            </div>
          ) : (
            <ul className="space-y-3">
              {reservas.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold">{r.destino_nome}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "confirmada" ? "bg-accent/20 text-accent-foreground" :
                        r.status === "cancelada" ? "bg-destructive/10 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>{r.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.data_expedicao ? new Date(r.data_expedicao).toLocaleDateString("pt-BR") : "Data a definir"} · {r.pessoas} pessoa{r.pessoas > 1 ? "s" : ""}
                    </p>
                    {r.observacoes && <p className="mt-1 text-sm text-muted-foreground">{r.observacoes}</p>}
                  </div>
                  <button
                    onClick={() => onCancelReserva(r.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Cancelar
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : (
          <form onSubmit={onSaveProfile} className="grid max-w-2xl gap-4">
            {[
              { key: "nome", label: "Nome completo", type: "text" },
              { key: "telefone", label: "Telefone / WhatsApp", type: "tel" },
              { key: "cidade", label: "Cidade", type: "text" },
              { key: "contato_emergencia", label: "Contato de emergência", type: "text" },
            ].map((f) => (
              <label key={f.key} className="block">
                <span className="text-sm font-medium">{f.label}</span>
                <input
                  type={f.type}
                  value={(profile as any)[f.key] ?? ""}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
            ))}
            <div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
