import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchDestinos,
  destinosQueryKey,
  NIVEIS,
  TIPOS,
  STATUS_LIST,
  type Destino,
} from "@/lib/destinos";

export const Route = createFileRoute("/_authenticated/admin/destinos")({
  component: AdminDestinos,
  head: () => ({ meta: [{ title: "Admin · Destinos — Dumas Trekk" }, { name: "robots", content: "noindex" }] }),
});

type FormState = {
  slug: string;
  nome: string;
  local: string;
  estado: string;
  pais: string;
  imagem: string;
  nivel: Destino["nivel"];
  duracao: string;
  precoDesde: string;
  altitude: string;
  clima: string;
  tipo: Destino["tipo"];
  data: string;
  status: Destino["status"];
  descricao: string;
  descricaoLonga: string;
  destaque: boolean;
  roteiro: string;
  incluso: string;
  naoIncluso: string;
  equipamentos: string;
  faq: string;
};

const EMPTY: FormState = {
  slug: "",
  nome: "",
  local: "",
  estado: "",
  pais: "Brasil",
  imagem: "/images/destino-chapada.jpg",
  nivel: "Moderado",
  duracao: "",
  precoDesde: "",
  altitude: "",
  clima: "",
  tipo: "Trekking",
  data: "",
  status: "Vagas abertas",
  descricao: "",
  descricaoLonga: "",
  destaque: false,
  roteiro: "",
  incluso: "",
  naoIncluso: "",
  equipamentos: "",
  faq: "",
};

// helpers para converter entre textarea (uma linha = um item) e arrays / objetos
const linesToArray = (s: string): string[] =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);

const arrayToLines = (a: string[] | null | undefined): string =>
  (a ?? []).join("\n");

const linesToPairs = <T extends string>(s: string, k1: T, k2: T): Record<T, string>[] =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [a, ...rest] = l.split("|");
      return { [k1]: (a ?? "").trim(), [k2]: rest.join("|").trim() } as Record<T, string>;
    });

const pairsToLines = (arr: Array<Record<string, string>>, k1: string, k2: string): string =>
  (arr ?? []).map((it) => `${it[k1] ?? ""} | ${it[k2] ?? ""}`).join("\n");

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function useIsAdmin() {
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean }>({ loading: true, isAdmin: false });
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return setState({ loading: false, isAdmin: false });
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setState({ loading: false, isAdmin: !!data });
    })();
  }, []);
  return state;
}

function AdminDestinos() {
  const { loading, isAdmin } = useIsAdmin();
  const qc = useQueryClient();
  const { data: destinos = [] } = useQuery({ queryKey: destinosQueryKey, queryFn: fetchDestinos });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = editingSlug !== null;
  const title = useMemo(() => (isEditing ? "Editar destino" : "Novo destino"), [isEditing]);

  if (loading) {
    return <div className="pt-40 text-center text-muted-foreground">Verificando permissões...</div>;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-6 pb-20 pt-40 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-serif text-3xl">Acesso restrito</h1>
        <p className="mt-2 text-muted-foreground">
          Esta área é exclusiva para administradores da Dumas Trekk. Se você deveria ter acesso, peça a um administrador para atribuir o papel <code>admin</code> à sua conta.
        </p>
        <Link to="/conta" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">
          Voltar para minha conta
        </Link>
      </section>
    );
  }

  const onEdit = (d: Destino) => {
    setEditingSlug(d.slug);
    setForm({
      slug: d.slug,
      nome: d.nome,
      local: d.local,
      estado: d.estado,
      pais: d.pais,
      imagem: d.imagem,
      nivel: d.nivel,
      duracao: d.duracao,
      precoDesde: String(d.precoDesde),
      altitude: d.altitude,
      clima: d.clima,
      tipo: d.tipo,
      data: d.data,
      status: d.status,
      descricao: d.descricao,
      descricaoLonga: d.descricaoLonga,
      destaque: d.destaque,
      roteiro: pairsToLines(d.roteiro as unknown as Array<Record<string, string>>, "titulo", "texto"),
      incluso: arrayToLines(d.incluso),
      naoIncluso: arrayToLines(d.naoIncluso),
      equipamentos: arrayToLines(d.equipamentos),
      faq: pairsToLines(d.faq as unknown as Array<Record<string, string>>, "q", "a"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCancel = () => {
    setEditingSlug(null);
    setForm(EMPTY);
  };

  const onDelete = async (slug: string) => {
    if (!confirm(`Remover o destino "${slug}"?`)) return;
    const { error } = await supabase.from("destinos").delete().eq("slug", slug);
    if (error) return toast.error("Erro ao remover: " + error.message);
    toast.success("Destino removido");
    qc.invalidateQueries({ queryKey: destinosQueryKey });
    if (editingSlug === slug) onCancel();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.nome);
    const payload = {
      slug,
      nome: form.nome.trim(),
      local: form.local.trim(),
      estado: form.estado.trim().toUpperCase(),
      pais: form.pais.trim() || "Brasil",
      imagem: form.imagem.trim(),
      nivel: form.nivel,
      duracao: form.duracao.trim(),
      preco_desde: Number(form.precoDesde),
      altitude: form.altitude.trim() || null,
      clima: form.clima.trim() || null,
      tipo: form.tipo,
      data_expedicao: form.data.trim() || null,
      status: form.status,
      descricao: form.descricao.trim(),
      descricao_longa: form.descricaoLonga.trim() || null,
      destaque: form.destaque,
      roteiro: linesToPairs(form.roteiro, "titulo", "texto"),
      incluso: linesToArray(form.incluso),
      nao_incluso: linesToArray(form.naoIncluso),
      equipamentos: linesToArray(form.equipamentos),
      faq: linesToPairs(form.faq, "q", "a"),
    } as never;

    if (!form.nome || !form.local || !form.descricao || !form.imagem || Number.isNaN(Number(form.precoDesde))) {
      setSaving(false);
      return toast.error("Preencha nome, local, imagem, preço e descrição");
    }

    const { error } = isEditing
      ? await supabase.from("destinos").update(payload).eq("slug", editingSlug!)
      : await supabase.from("destinos").insert(payload);

    setSaving(false);
    if (error) return toast.error("Erro ao salvar: " + error.message);
    toast.success(isEditing ? "Destino atualizado" : "Destino criado");
    qc.invalidateQueries({ queryKey: destinosQueryKey });
    onCancel();
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Administração</p>
          <h1 className="mt-1 font-serif text-4xl">Gerenciar destinos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Adicione, edite ou remova expedições exibidas no site.</p>
        </div>
        <Link to="/destinos" className="text-sm text-primary hover:underline">Ver site público →</Link>
      </div>

      {/* FORM */}
      <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{title}</h2>
          {isEditing && (
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs hover:bg-muted">
              <X className="h-3 w-3" /> Cancelar edição
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome da expedição *">
            <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={inputCls} />
          </Field>
          <Field label={`Slug (URL) ${isEditing ? "" : "— gerado do nome"}`}>
            <input
              disabled={isEditing}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder={form.nome ? slugify(form.nome) : "ex: chapada-diamantina"}
              className={inputCls + (isEditing ? " opacity-60" : "")}
            />
          </Field>
          <Field label="Local *">
            <input required value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estado (UF) *">
              <input required maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} className={inputCls} />
            </Field>
            <Field label="País">
              <input value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="URL da imagem *">
            <input required value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} placeholder="/images/... ou https://..." className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nível">
              <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value as Destino["nivel"] })} className={inputCls}>
                {NIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Destino["tipo"] })} className={inputCls}>
                {TIPOS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duração">
              <input value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} placeholder="5 dias" className={inputCls} />
            </Field>
            <Field label="Preço desde (R$) *">
              <input required type="number" min={0} step="0.01" value={form.precoDesde} onChange={(e) => setForm({ ...form, precoDesde: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Altitude">
              <input value={form.altitude} onChange={(e) => setForm({ ...form, altitude: e.target.value })} placeholder="1.200 m" className={inputCls} />
            </Field>
            <Field label="Clima">
              <input value={form.clima} onChange={(e) => setForm({ ...form, clima: e.target.value })} placeholder="Ameno, 15–28°C" className={inputCls} />
            </Field>
          </div>
          <Field label="Data da expedição">
            <input value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} placeholder="12–16 Mar 2026" className={inputCls} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Destino["status"] })} className={inputCls}>
              {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Descrição curta (usada nos cards e no topo do destino) *">
              <textarea required rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Descrição longa (sobre a expedição — separe parágrafos com linha em branco)">
              <textarea rows={6} value={form.descricaoLonga} onChange={(e) => setForm({ ...form, descricaoLonga: e.target.value })} className={inputCls} placeholder="Um texto mais aprofundado sobre a experiência, contexto, o que torna essa expedição única..." />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Roteiro dia a dia — uma linha por dia, no formato: Título | Descrição">
              <textarea rows={6} value={form.roteiro} onChange={(e) => setForm({ ...form, roteiro: e.target.value })} className={inputCls + " font-mono text-xs"} placeholder={"Chegada e briefing | Recepção no ponto de encontro e checagem de equipamentos\nPrimeira trilha | Caminhada em ritmo confortável com paradas técnicas\n..."} />
            </Field>
          </div>

          <Field label="O que está incluso — um item por linha">
            <textarea rows={6} value={form.incluso} onChange={(e) => setForm({ ...form, incluso: e.target.value })} className={inputCls + " font-mono text-xs"} placeholder={"Guias certificados\nRefeições completas\nHospedagem\nTransfer local"} />
          </Field>
          <Field label="Não incluso — um item por linha">
            <textarea rows={6} value={form.naoIncluso} onChange={(e) => setForm({ ...form, naoIncluso: e.target.value })} className={inputCls + " font-mono text-xs"} placeholder={"Passagens até o ponto de encontro\nBebidas alcoólicas\nEquipamentos pessoais"} />
          </Field>

          <div className="md:col-span-2">
            <Field label="Equipamentos necessários — um item por linha">
              <textarea rows={4} value={form.equipamentos} onChange={(e) => setForm({ ...form, equipamentos: e.target.value })} className={inputCls + " font-mono text-xs"} placeholder={"Mochila 40L\nBota de trilha\nCapa de chuva"} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Perguntas frequentes — uma linha por pergunta, no formato: Pergunta | Resposta">
              <textarea rows={5} value={form.faq} onChange={(e) => setForm({ ...form, faq: e.target.value })} className={inputCls + " font-mono text-xs"} placeholder={"Preciso ter experiência? | Depende do nível da expedição...\nComo funciona o cancelamento? | Cancelamentos com mais de 30 dias..."} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} />
            Exibir na home como destaque
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Plus className="h-4 w-4" />
            {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar destino"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <div className="mt-12">
        <h2 className="mb-4 font-serif text-2xl">Destinos cadastrados ({destinos.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 hidden md:table-cell">Local</th>
                <th className="px-4 py-3 hidden md:table-cell">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {destinos.map((d) => (
                <tr key={d.slug} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{d.nome}</div>
                    <div className="text-xs text-muted-foreground">{d.slug}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{d.local} · {d.estado}</td>
                  <td className="px-4 py-3 hidden md:table-cell">R$ {d.precoDesde.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{d.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => onEdit(d)} className="rounded-full p-2 hover:bg-muted" title="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(d.slug)} className="rounded-full p-2 text-destructive hover:bg-destructive/10" title="Remover"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {destinos.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Nenhum destino cadastrado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
