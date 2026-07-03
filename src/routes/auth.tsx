import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Dumas Trekk" },
      { name: "description", content: "Acesse sua conta Dumas Trekk para gerenciar suas expedições e reservas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/conta" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode entrar.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/conta" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Erro ao entrar com Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/conta" });
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-dumas.jpg)" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full rounded-2xl bg-background/95 p-8 shadow-2xl backdrop-blur">
          <Link to="/" className="mb-6 flex items-center gap-2 font-serif text-xl font-semibold">
            <Mountain className="h-6 w-6 text-primary" strokeWidth={1.5} />
            Dumas Trekk
          </Link>
          <h1 className="font-serif text-2xl font-semibold">
            {mode === "signin" ? "Entrar na sua conta" : "Criar sua conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Acesse suas reservas e perfil."
              : "Comece sua próxima aventura."}
          </p>

          <button
            onClick={onGoogle}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-input bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z"/></svg>
            Continuar com Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                required
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            )}
            <input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signin" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
