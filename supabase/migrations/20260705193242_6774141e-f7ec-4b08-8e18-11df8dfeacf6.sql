
ALTER TABLE public.destinos
  ADD COLUMN IF NOT EXISTS descricao_longa text,
  ADD COLUMN IF NOT EXISTS roteiro jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS incluso text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS nao_incluso text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS equipamentos text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS faq jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Seed com valores razoáveis para destinos existentes que ainda não têm conteúdo
UPDATE public.destinos SET
  roteiro = '[
    {"titulo":"Chegada e briefing","texto":"Recepção no ponto de encontro, checagem de equipamentos e alinhamento da expedição com os guias."},
    {"titulo":"Primeira trilha","texto":"Início da caminhada em ritmo confortável, com paradas técnicas e almoço na natureza."},
    {"titulo":"Imersão","texto":"Dia dedicado ao contato profundo com o ambiente, fotografia e descanso."},
    {"titulo":"Travessia principal","texto":"O grande dia: percurso mais desafiador com vistas inesquecíveis."},
    {"titulo":"Retorno","texto":"Descida gradual, almoço de encerramento e transfer de volta."}
  ]'::jsonb
WHERE roteiro = '[]'::jsonb;

UPDATE public.destinos SET
  incluso = ARRAY['Guias certificados','Refeições completas','Hospedagem em pousadas / camping','Transfer local','Seguro aventura','Kit primeiros socorros'],
  nao_incluso = ARRAY['Passagens até o ponto de encontro','Bebidas alcoólicas','Equipamentos pessoais','Extras não previstos'],
  equipamentos = ARRAY['Mochila 40L','Bota de trilha','Capa de chuva','Lanterna','Roupas em camadas','Garrafa 1L','Protetor solar','Chapéu']
WHERE cardinality(incluso) = 0;

UPDATE public.destinos SET
  faq = '[
    {"q":"Preciso ter experiência?","a":"Depende do nível da expedição. Para Fácil e Moderado, qualquer pessoa com bom condicionamento consegue participar."},
    {"q":"Como funciona o cancelamento?","a":"Cancelamentos com mais de 30 dias têm reembolso integral menos taxas. Consulte a política completa."},
    {"q":"Quantas pessoas por grupo?","a":"Máximo de 12 aventureiros por saída, garantindo experiência de qualidade e baixo impacto."},
    {"q":"E se chover?","a":"Nossas expedições acontecem em qualquer condição climática segura. Guias avaliam o risco em tempo real."}
  ]'::jsonb
WHERE faq = '[]'::jsonb;
