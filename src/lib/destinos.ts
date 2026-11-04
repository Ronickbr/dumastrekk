import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type RoteiroDia = { titulo: string; texto: string };
export type FAQItem = { q: string; a: string };

export type Destino = {
  slug: string;
  nome: string;
  local: string;
  estado: string;
  pais: string;
  imagem: string;
  nivel: "Fácil" | "Moderado" | "Difícil" | "Expedição";
  duracao: string;
  precoDesde: number;
  altitude: string;
  clima: string;
  tipo: "Trekking" | "Cachoeiras" | "Montanhismo" | "Acampamento";
  data: string;
  status: "Vagas abertas" | "Últimas vagas" | "Confirmada" | "Esgotada";
  descricao: string;
  descricaoLonga: string;
  destaque: boolean;
  roteiro: RoteiroDia[];
  incluso: string[];
  naoIncluso: string[];
  equipamentos: string[];
  faq: FAQItem[];
};

type Row = Database["public"]["Tables"]["destinos"]["Row"];

function parseJsonArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? (p as T[]) : []; } catch { return []; }
  }
  return [];
}

export function mapRowToDestino(r: Row): Destino {
  const anyRow = r as unknown as Record<string, unknown>;
  return {
    slug: r.slug,
    nome: r.nome,
    local: r.local,
    estado: r.estado,
    pais: r.pais,
    imagem: r.imagem,
    nivel: r.nivel as Destino["nivel"],
    duracao: r.duracao,
    precoDesde: Number(r.preco_desde),
    altitude: r.altitude ?? "",
    clima: r.clima ?? "",
    tipo: r.tipo as Destino["tipo"],
    data: r.data_expedicao ?? "",
    status: r.status as Destino["status"],
    descricao: r.descricao,
    descricaoLonga: (anyRow.descricao_longa as string | null) ?? "",
    destaque: r.destaque,
    roteiro: parseJsonArray<RoteiroDia>(anyRow.roteiro),
    incluso: (anyRow.incluso as string[] | null) ?? [],
    naoIncluso: (anyRow.nao_incluso as string[] | null) ?? [],
    equipamentos: (anyRow.equipamentos as string[] | null) ?? [],
    faq: parseJsonArray<FAQItem>(anyRow.faq),
  };
}

export async function fetchDestinos(): Promise<Destino[]> {
  const { data, error } = await supabase
    .from("destinos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRowToDestino);
}

export async function fetchDestino(slug: string): Promise<Destino | null> {
  const { data, error } = await supabase.from("destinos").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapRowToDestino(data) : null;
}

export const destinosQueryKey = ["destinos"] as const;
export const destinoQueryKey = (slug: string) => ["destino", slug] as const;

export const NIVEIS: Destino["nivel"][] = ["Fácil", "Moderado", "Difícil", "Expedição"];
export const TIPOS: Destino["tipo"][] = ["Trekking", "Cachoeiras", "Montanhismo", "Acampamento"];
export const STATUS_LIST: Destino["status"][] = ["Vagas abertas", "Últimas vagas", "Confirmada", "Esgotada"];
