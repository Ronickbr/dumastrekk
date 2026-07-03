import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "@/lib/blog";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
  loader: async ({ params }) => {
    const post = await fetchPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Post não encontrado — Dumas Trekk" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.post;
    const url = `https://dumastrekk.lovable.app/blog/${params.slug}`;
    return {
      meta: [
        { title: `${p.titulo} — Dumas Trekk` },
        { name: "description", content: p.resumo },
        { property: "og:title", content: p.titulo },
        { property: "og:description", content: p.resumo },
        { property: "og:image", content: p.imagem },
        { name: "twitter:image", content: p.imagem },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "article:author", content: p.autor },
        { property: "article:published_time", content: p.created_at },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.titulo,
          description: p.resumo,
          image: p.imagem,
          datePublished: p.created_at,
          author: { "@type": "Person", name: p.autor },
          publisher: { "@type": "Organization", name: "Dumas Trekk", logo: { "@type": "ImageObject", url: "https://dumastrekk.lovable.app/logo-dumas.png" } },
          mainEntityOfPage: url,
        }),
      }],
    };
  },
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
