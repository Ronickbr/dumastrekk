
DROP POLICY IF EXISTS "Users criam próprios pedidos" ON public.pedidos;

CREATE POLICY "Users criam próprios pedidos pendentes"
ON public.pedidos
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pendente'
  AND mp_payment_id IS NULL
  AND mp_preference_id IS NULL
);

ALTER TABLE public.pedidos
  DROP CONSTRAINT IF EXISTS pedidos_status_check;
ALTER TABLE public.pedidos
  ADD CONSTRAINT pedidos_status_check
  CHECK (status IN ('pendente','pago','falha','cancelado'));

ALTER TABLE public.pedidos
  DROP CONSTRAINT IF EXISTS pedidos_pago_requer_mp_payment;
ALTER TABLE public.pedidos
  ADD CONSTRAINT pedidos_pago_requer_mp_payment
  CHECK (status <> 'pago' OR mp_payment_id IS NOT NULL);
