import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPosts, blogQueryKey, type BlogPost } from "@/lib/blog";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: AdminBlog,
  head: () => ({ meta: [{ title: "Admin · Blog — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});

type FormState = {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  publicado: boolean;
};

const EMPTY: FormState = {
  slug: "",
  titulo: "",
  resumo: "",
  conteudo: "",
  imagem: "/images/destino-chapada.jpg",
  autor: "Dumas Trekk",
  publicado: true,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function useIsAdmin() {
  const [state, setState] = useState({ loading: true, isAdmin: false });
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setState({ loading: false, isAdmin: false });
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setState({ loading: false, isAdmin: !!data });
    })();
  }, []);
  return state;
}

function AdminBlog() {
  const { loading, isAdmin } = useIsAdmin();
  const qc = useQueryClient();
  const { data: posts = [] } = useQuery({ queryKey: [...blogQueryKey, "all"], queryFn: () => fetchPosts(true) });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const onEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({ slug: p.slug, titulo: p.titulo, resumo: p.resumo, conteudo: p.conteudo, imagem: p.imagem, autor: p.autor, publicado: p.publicado });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onCancel = () => { setEditingId(null); setForm(EMPTY); };

  const onDelete = async (id: string) => {
    if (!confirm("Remover este post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post removido");
    qc.invalidateQueries({ queryKey: blogQueryKey });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.titulo);
    const payload = { slug, titulo: form.titulo.trim(), resumo: form.resumo.trim(), conteudo: form.conteudo, imagem: form.imagem.trim(), autor: form.autor.trim() || "Dumas Trekk", publicado: form.publicado };
    if (!payload.titulo || !payload.resumo || !payload.conteudo || !payload.imagem) { setSaving(false); return toast.error("Preencha todos os campos"); }
    const { error } = editingId ? await supabase.from("blog_posts").update(payload).eq("id", editingId) : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Post atualizado" : "Post criado");
    qc.invalidateQueries({ queryKey: blogQueryKey });
    onCancel();
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Administração</p>
          <h1 className="mt-1 font-serif text-4xl">Gerenciar blog</h1>
        </div>
        <Link to="/blog" className="text-sm text-primary hover:underline">Ver blog público →</Link>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{editingId ? "Editar post" : "Novo post"}</h2>
          {editingId && <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs hover:bg-muted"><X className="h-3 w-3" /> Cancelar</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título *"><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={inputCls} /></Field>
          <Field label={`Slug ${editingId ? "" : "(gerado do título)"}`}>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder={slugify(form.titulo)} className={inputCls} />
          </Field>
          <Field label="Autor"><input value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} className={inputCls} /></Field>
          <Field label="URL da imagem *"><input required value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} className={inputCls} /></Field>
          <div className="md:col-span-2"><Field label="Resumo *"><textarea required rows={2} value={form.resumo} onChange={(e) => setForm({ ...form, resumo: e.target.value })} className={inputCls} /></Field></div>
          <div className="md:col-span-2"><Field label="Conteúdo (markdown) *"><textarea required rows={10} value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} className={inputCls + " font-mono"} /></Field></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} /> Publicado (visível no site)</label>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? "Salvando..." : editingId ? "Salvar" : "Criar post"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="mb-4 font-serif text-2xl">Posts ({posts.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="px-4 py-3">Título</th><th className="px-4 py-3 hidden md:table-cell">Data</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3"><div className="font-medium">{p.titulo}</div><div className="text-xs text-muted-foreground">{p.slug}</div></td>
                  <td className="px-4 py-3 hidden md:table-cell">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">{p.publicado ? <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Publicado</span> : <span className="rounded-full bg-muted px-2 py-1 text-xs">Rascunho</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => onEdit(p)} className="rounded-full p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(p.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">Nenhum post ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}
