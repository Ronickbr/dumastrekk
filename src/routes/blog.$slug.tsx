import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "@/lib/blog";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
  head: () => ({ meta: [{ title: "Post — Dumas Trekk" }] }),
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: () => fetchPostBySlug(slug),
  });

  if (isLoading) return <p className="pt-40 text-center text-muted-foreground">Carregando...</p>;
  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-40 text-center">
        <h1 className="font-serif text-3xl">Post não encontrado</h1>
        <Link to="/blog" className="mt-6 inline-flex text-primary hover:underline">← Voltar ao blog</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Blog
      </Link>
      <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{post.titulo}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {new Date(post.created_at).toLocaleDateString("pt-BR")} · {post.autor}
      </div>
      <img src={post.imagem} alt={post.titulo} className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
      <p className="mt-8 text-lg text-muted-foreground">{post.resumo}</p>
      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap font-sans text-base leading-relaxed dark:prose-invert">
        {post.conteudo}
      </div>
    </article>
  );
}
