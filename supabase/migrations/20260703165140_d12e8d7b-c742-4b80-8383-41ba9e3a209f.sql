
-- Enum de papéis
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Função has_role (SECURITY DEFINER para evitar recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Tabela destinos
CREATE TABLE public.destinos (
  slug TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  local TEXT NOT NULL,
  estado TEXT NOT NULL,
  pais TEXT NOT NULL DEFAULT 'Brasil',
  imagem TEXT NOT NULL,
  nivel TEXT NOT NULL,
  duracao TEXT NOT NULL,
  preco_desde NUMERIC(10,2) NOT NULL,
  altitude TEXT,
  clima TEXT,
  tipo TEXT NOT NULL,
  data_expedicao TEXT,
  status TEXT NOT NULL DEFAULT 'Vagas abertas',
  descricao TEXT NOT NULL,
  destaque BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.destinos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destinos TO authenticated;
GRANT ALL ON public.destinos TO service_role;

ALTER TABLE public.destinos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinos são públicos" ON public.destinos
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins inserem destinos" ON public.destinos
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam destinos" ON public.destinos
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem destinos" ON public.destinos
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger de updated_at (reutiliza função existente)
CREATE TRIGGER update_destinos_updated_at
  BEFORE UPDATE ON public.destinos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed com destinos atuais
INSERT INTO public.destinos (slug, nome, local, estado, pais, imagem, nivel, duracao, preco_desde, altitude, clima, tipo, data_expedicao, status, descricao, destaque) VALUES
  ('chapada-diamantina', 'Travessia do Vale do Pati', 'Chapada Diamantina', 'BA', 'Brasil', '/images/destino-chapada.jpg', 'Moderado', '5 dias', 3890, '1.200 m', 'Ameno, 15–28°C', 'Trekking', '12–16 Mar 2026', 'Últimas vagas', 'Uma das travessias mais icônicas do Brasil, passando por vales profundos, cachoeiras e comunidades tradicionais.', true),
  ('pico-da-neblina', 'Expedição Pico da Neblina', 'Amazonas', 'AM', 'Brasil', '/images/destino-pico.jpg', 'Expedição', '10 dias', 12490, '2.995 m', 'Úmido, 8–22°C', 'Montanhismo', '05–14 Ago 2026', 'Confirmada', 'Ao ponto mais alto do Brasil em parceria com comunidades Yanomami. Uma imersão profunda na floresta e na cultura.', true),
  ('vale-cachoeiras', 'Vale das Cachoeiras', 'Serra da Canastra', 'MG', 'Brasil', '/images/destino-cachoeira.jpg', 'Fácil', '3 dias', 1990, '900 m', 'Ameno, 18–26°C', 'Cachoeiras', '22–24 Abr 2026', 'Vagas abertas', 'Três dias entre quedas d''água imponentes, banhos gelados e trilhas suaves. Ideal para primeira aventura.', false),
  ('acampamento-estrelas', 'Acampamento sob as Estrelas', 'Serra do Cipó', 'MG', 'Brasil', '/images/destino-acampamento.jpg', 'Fácil', '2 dias', 1290, '1.100 m', 'Frio à noite, 5–24°C', 'Acampamento', '15–16 Mai 2026', 'Vagas abertas', 'Fotografia noturna, fogueira e um dos céus mais límpidos do Sudeste. Perfeito para desconectar.', false);
