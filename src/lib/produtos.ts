import { supabase } from "@/integrations/supabase/client";

export type CampoPersonalizacao = {
  nome: string;
  label: string;
  tipo: "text" | "select";
  opcoes?: string[];
};

export type Produto = {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  personalizacao_campos: CampoPersonalizacao[];
  created_at: string;
};

export const produtosQueryKey = ["produtos"] as const;

export async function fetchProdutos(all = false): Promise<Produto[]> {
  const query = supabase.from("produtos").select("*").order("created_at", { ascending: false });
  const { data, error } = all ? await query : await query.eq("ativo", true);
  if (error) throw error;
  return (data ?? []).map((p: any) => ({
    ...p,
    preco: Number(p.preco),
    personalizacao_campos: (p.personalizacao_campos ?? []) as CampoPersonalizacao[],
  })) as Produto[];
}

export async function fetchProdutoBySlug(slug: string): Promise<Produto | null> {
  const { data, error } = await supabase.from("produtos").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as any),
    preco: Number((data as any).preco),
    personalizacao_campos: ((data as any).personalizacao_campos ?? []) as CampoPersonalizacao[],
  } as Produto;
}
