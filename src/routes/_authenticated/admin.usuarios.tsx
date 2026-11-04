import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Shield, ShieldAlert, ShieldOff, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listAdminUsers,
  grantAdminRole,
  revokeAdminRole,
  inviteAdminUser,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  component: AdminUsuarios,
  head: () => ({ meta: [{ title: "Admin · Usuários — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});

function useIsAdmin() {
  const [state, setState] = useState({ loading: true, isAdmin: false, meId: null as string | null });
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setState({ loading: false, isAdmin: false, meId: null });
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setState({ loading: false, isAdmin: !!data, meId: u.user.id });
    })();
  }, []);
  return state;
}

function AdminUsuarios() {
  const { loading, isAdmin, meId } = useIsAdmin();
  const qc = useQueryClient();
  const list = useServerFn(listAdminUsers);
  const grant = useServerFn(grantAdminRole);
  const revoke = useServerFn(revokeAdminRole);
  const invite = useServerFn(inviteAdminUser);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => list(),
    enabled: isAdmin,
  });

  const [email, setEmail] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  if (loading) return <div className="pt-40 text-center text-muted-foreground">Verificando permissões...</div>;
  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-6 pb-20 pt-40 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-serif text-3xl">Acesso restrito</h1>
        <Link to="/conta" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Voltar</Link>
      </section>
    );
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin_users"] });

  const onGrant = async (userId: string) => {
    setBusyId(userId);
    try { await grant({ data: { userId } }); toast.success("Admin concedido"); refresh(); }
    catch (e: any) { toast.error(e.message ?? "Erro"); }
    finally { setBusyId(null); }
  };
  const onRevoke = async (userId: string) => {
    if (!confirm("Remover o acesso admin deste usuário?")) return;
    setBusyId(userId);
    try { await revoke({ data: { userId } }); toast.success("Admin removido"); refresh(); }
    catch (e: any) { toast.error(e.message ?? "Erro"); }
    finally { setBusyId(null); }
  };
  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await invite({ data: { email } });
      toast.success(`Admin adicionado (convite enviado se novo usuário)`);
      setEmail("");
      refresh();
    } catch (e: any) { toast.error(e.message ?? "Erro"); }
    finally { setInviting(false); }
  };

  return (
    <section className="pb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Administração</p>
          <h1 className="mt-1 font-serif text-4xl">Gerenciar administradores</h1>
          <p className="mt-2 text-sm text-muted-foreground">Conceda ou remova o papel de admin de outros usuários.</p>
        </div>
        <Link to="/conta" className="text-sm text-primary hover:underline">← Minha conta</Link>
      </div>

      <form onSubmit={onInvite} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl">Adicionar novo admin por email</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Se o email já tem conta, ele vira admin imediatamente. Caso contrário, enviamos um convite por email.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="novo-admin@email.com"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {inviting ? "Adicionando..." : "Conceder admin"}
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Usuários ({users.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 hidden md:table-cell">Cadastro</th>
                <th className="px-4 py-3 hidden md:table-cell">Último acesso</th>
                <th className="px-4 py-3">Papel</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Carregando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Nenhum usuário.</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.email ?? "—"}</div>
                    {u.id === meId && <div className="text-xs text-primary">você</div>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {u.is_admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Usuário</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.is_admin ? (
                      <button
                        onClick={() => onRevoke(u.id)}
                        disabled={busyId === u.id || u.id === meId}
                        title={u.id === meId ? "Você não pode remover seu próprio admin" : "Remover admin"}
                        className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-40"
                      >
                        <ShieldOff className="h-3 w-3" /> Remover
                      </button>
                    ) : (
                      <button
                        onClick={() => onGrant(u.id)}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/15 disabled:opacity-40"
                      >
                        <Shield className="h-3 w-3" /> Tornar admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
