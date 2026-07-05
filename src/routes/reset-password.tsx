import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — Dumas Trekk" },
      { name: "description", content: "Defina uma nova senha para sua conta Dumas Trekk." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase entrega o token no hash e cria uma sessão de "recovery"
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Fallback: se já veio com sessão hidratada
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Senha deve ter pelo menos 6 caracteres");
    if (password !== confirm) return toast.error("As senhas não coincidem");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      await supabase.auth.signOut();
      navigate({ to: "/auth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-dumas.jpg)" }} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full rounded-2xl bg-background/95 p-8 shadow-2xl backdrop-blur">
          <Link to="/" className="mb-6 flex items-center gap-2 font-serif text-xl font-semibold">
            <Mountain className="h-6 w-6 text-primary" strokeWidth={1.5} />
            Dumas Trekk
          </Link>
          <h1 className="font-serif text-2xl font-semibold">Redefinir senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ready
              ? "Escolha uma nova senha segura para sua conta."
              : "Validando link de recuperação..."}
          </p>

          {ready ? (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input
                type="password"
                required
                minLength={6}
                placeholder="Nova senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Confirmar nova senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Se o link expirou ou é inválido,{" "}
              <Link to="/auth" className="font-medium text-primary hover:underline">
                solicite um novo
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
