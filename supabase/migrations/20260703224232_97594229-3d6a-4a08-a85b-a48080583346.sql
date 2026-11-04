
-- Move has_role out of the exposed public API schema
CREATE SCHEMA IF NOT EXISTS private;

-- Recreate function in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies to reference private.has_role
-- destinos
DROP POLICY IF EXISTS "Admins inserem destinos" ON public.destinos;
DROP POLICY IF EXISTS "Admins atualizam destinos" ON public.destinos;
DROP POLICY IF EXISTS "Admins removem destinos" ON public.destinos;
CREATE POLICY "Admins inserem destinos" ON public.destinos FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins atualizam destinos" ON public.destinos FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins removem destinos" ON public.destinos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- blog_posts
DROP POLICY IF EXISTS "Posts publicados são públicos" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins inserem posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins atualizam posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins removem posts" ON public.blog_posts;
CREATE POLICY "Posts publicados são públicos" ON public.blog_posts FOR SELECT USING ((publicado = true) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins inserem posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins atualizam posts" ON public.blog_posts FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins removem posts" ON public.blog_posts FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- produtos
DROP POLICY IF EXISTS "Produtos ativos públicos" ON public.produtos;
DROP POLICY IF EXISTS "Admins inserem produtos" ON public.produtos;
DROP POLICY IF EXISTS "Admins atualizam produtos" ON public.produtos;
DROP POLICY IF EXISTS "Admins removem produtos" ON public.produtos;
CREATE POLICY "Produtos ativos públicos" ON public.produtos FOR SELECT USING ((ativo = true) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins inserem produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins atualizam produtos" ON public.produtos FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins removem produtos" ON public.produtos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- pedidos
DROP POLICY IF EXISTS "Users veem próprios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Admins atualizam pedidos" ON public.pedidos;
CREATE POLICY "Users veem próprios pedidos" ON public.pedidos FOR SELECT TO authenticated USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins atualizam pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop the public function last (now unreferenced)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
