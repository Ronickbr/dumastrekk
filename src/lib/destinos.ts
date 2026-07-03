import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
  destaque: boolean;
};

type Row = Database["public"]["Tables"]["destinos"]["Row"];

export function mapRowToDestino(r: Row): Destino {
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
    destaque: r.destaque,
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
