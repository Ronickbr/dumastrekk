import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProdutos, produtosQueryKey, type Produto, type CampoPersonalizacao } from "@/lib/produtos";

export const Route = createFileRoute("/_authenticated/admin/produtos")({
  component: AdminProdutos,
  head: () => ({ meta: [{ title: "Admin · Produtos — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});

type FormState = {
  slug: string;
  nome: string;
  descricao: string;
  imagem: string;
  preco: string;
  estoque: string;
  ativo: boolean;
  temTamanho: boolean;
  tamanhos: string;
};

const EMPTY: FormState = {
  slug: "",
  nome: "",
  descricao: "",
  imagem: "",
  preco: "",
  estoque: "10",
  ativo: true,
  temTamanho: false,
  tamanhos: "P, M, G, GG",
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

function AdminProdutos() {
  const { loading, isAdmin } = useIsAdmin();
  const qc = useQueryClient();
  const { data: produtos = [] } = useQuery({ queryKey: [...produtosQueryKey, "all"], queryFn: () => fetchProdutos(true) });
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

  const onEdit = (p: Produto) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug, nome: p.nome, descricao: p.descricao, imagem: p.imagem,
      preco: String(p.preco), estoque: String(p.estoque), ativo: p.ativo,
      camposJson: JSON.stringify(p.personalizacao_campos, null, 2),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onCancel = () => { setEditingId(null); setForm(EMPTY); };

  const onDelete = async (id: string) => {
    if (!confirm("Remover este produto?")) return;
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto removido");
    qc.invalidateQueries({ queryKey: produtosQueryKey });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let campos: CampoPersonalizacao[] = [];
    try { campos = JSON.parse(form.camposJson); if (!Array.isArray(campos)) throw new Error(); }
    catch { return toast.error("Campos de personalização: JSON inválido"); }

    const preco = Number(form.preco);
    const estoque = Number(form.estoque);
    if (!form.nome || !form.descricao || !form.imagem || Number.isNaN(preco)) return toast.error("Preencha os campos obrigatórios");

    const slug = form.slug || slugify(form.nome);
    const payload = { slug, nome: form.nome.trim(), descricao: form.descricao.trim(), imagem: form.imagem.trim(), preco, estoque: Number.isFinite(estoque) ? estoque : 0, ativo: form.ativo, personalizacao_campos: campos as unknown as any };

    setSaving(true);
    const { error } = editingId ? await supabase.from("produtos").update(payload).eq("id", editingId) : await supabase.from("produtos").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Produto atualizado" : "Produto criado");
    qc.invalidateQueries({ queryKey: produtosQueryKey });
    onCancel();
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Administração</p>
          <h1 className="mt-1 font-serif text-4xl">Gerenciar produtos</h1>
        </div>
        <Link to="/produtos" className="text-sm text-primary hover:underline">Ver loja pública →</Link>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{editingId ? "Editar produto" : "Novo produto"}</h2>
          {editingId && <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs hover:bg-muted"><X className="h-3 w-3" /> Cancelar</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome *"><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={inputCls} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder={slugify(form.nome)} className={inputCls} /></Field>
          <Field label="URL da imagem *"><input required value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço (R$) *"><input required type="number" step="0.01" min={0} value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className={inputCls} /></Field>
            <Field label="Estoque"><input type="number" min={0} value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="md:col-span-2"><Field label="Descrição *"><textarea required rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className={inputCls} /></Field></div>
          <div className="md:col-span-2">
            <Field label='Campos de personalização (JSON) — ex: [{"nome":"cor","label":"Cor","tipo":"select","opcoes":["Preto","Verde"]}]'>
              <textarea rows={8} value={form.camposJson} onChange={(e) => setForm({ ...form, camposJson: e.target.value })} className={inputCls + " font-mono text-xs"} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /> Ativo (visível na loja)</label>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? "Salvando..." : editingId ? "Salvar" : "Criar produto"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="mb-4 font-serif text-2xl">Produtos ({produtos.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3 hidden md:table-cell">Preço</th><th className="px-4 py-3 hidden md:table-cell">Estoque</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {produtos.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3"><div className="font-medium">{p.nome}</div><div className="text-xs text-muted-foreground">{p.slug}</div></td>
                  <td className="px-4 py-3 hidden md:table-cell">R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{p.estoque}</td>
                  <td className="px-4 py-3">{p.ativo ? <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Ativo</span> : <span className="rounded-full bg-muted px-2 py-1 text-xs">Inativo</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => onEdit(p)} className="rounded-full p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(p.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {produtos.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Nenhum produto ainda.</td></tr>}
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
