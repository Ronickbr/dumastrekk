import { supabase } from "@/integrations/supabase/client";

export type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  publicado: boolean;
  created_at: string;
};

export const blogQueryKey = ["blog_posts"] as const;

export async function fetchPosts(all = false): Promise<BlogPost[]> {
  const query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  const { data, error } = all ? await query : await query.eq("publicado", true);
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as BlogPost) ?? null;
}
