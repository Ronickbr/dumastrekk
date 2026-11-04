
-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL,
  conteudo text NOT NULL,
  imagem text NOT NULL,
  autor text NOT NULL DEFAULT 'Dumas Trekk',
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts publicados são públicos" ON public.blog_posts FOR SELECT USING (publicado = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins inserem posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins atualizam posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins removem posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PRODUTOS
CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text NOT NULL,
  imagem text NOT NULL,
  preco numeric NOT NULL,
  estoque integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  personalizacao_campos jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.produtos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos ativos públicos" ON public.produtos FOR SELECT USING (ativo = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins inserem produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins atualizam produtos" ON public.produtos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins removem produtos" ON public.produtos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PEDIDOS
CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
  quantidade integer NOT NULL DEFAULT 1,
  personalizacao jsonb NOT NULL DEFAULT '{}'::jsonb,
  valor_total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pedidos TO authenticated;
GRANT ALL ON public.pedidos TO service_role;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users veem próprios pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users criam próprios pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins atualizam pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed alguns posts
INSERT INTO public.blog_posts (slug, titulo, resumo, conteudo, imagem) VALUES
('preparacao-trekking', 'Como se preparar para seu primeiro trekking', 'Dicas essenciais de equipamento, condicionamento e mentalidade para encarar sua primeira expedição.', E'# Como se preparar\n\nUm bom trekking começa muito antes do primeiro passo na trilha. Aqui vão os pilares:\n\n## 1. Condicionamento\nCaminhe pelo menos 3x por semana com mochila carregada.\n\n## 2. Equipamento\n- Bota impermeável já amaciada\n- Mochila de 40–50L\n- Capa de chuva\n\n## 3. Mentalidade\nRespeite seu ritmo. A montanha não é competição.', '/images/destino-chapada.jpg'),
('lista-mochila', 'Lista essencial da mochila de expedição', 'O que levar (e o que deixar) para 5 dias de trilha em regiões remotas.', E'# Lista essencial\n\n- Saco de dormir térmico\n- Isolante\n- Lanterna de cabeça\n- Kit primeiros socorros\n- Filtro de água', '/images/destino-chapada.jpg');

-- Seed produtos exemplo
INSERT INTO public.produtos (slug, nome, descricao, imagem, preco, estoque, personalizacao_campos) VALUES
('camiseta-expedicao', 'Camiseta Expedição Dumas', 'Camiseta técnica com secagem rápida, personalizada com seu nome ou apelido bordado.', '/images/destino-chapada.jpg', 129.90, 50, '[{"nome":"tamanho","label":"Tamanho","tipo":"select","opcoes":["P","M","G","GG"]},{"nome":"cor","label":"Cor","tipo":"select","opcoes":["Preto","Verde militar","Areia"]},{"nome":"nome_bordado","label":"Nome bordado (opcional)","tipo":"text"}]'::jsonb),
('caneca-trilheiro', 'Caneca Trilheiro 350ml', 'Caneca esmaltada resistente para o café da manhã na trilha, personalizável com seu nome.', '/images/destino-chapada.jpg', 59.90, 100, '[{"nome":"nome_gravado","label":"Nome gravado","tipo":"text"}]'::jsonb);
