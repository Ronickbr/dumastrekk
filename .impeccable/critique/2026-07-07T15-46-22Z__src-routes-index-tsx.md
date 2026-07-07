---
target: src/routes/index.tsx
total_score: 35
p0_count: 0
p1_count: 2
timestamp: 2026-07-07T15-46-22Z
slug: src-routes-index-tsx
---
# Design Critique: src/routes/index.tsx

Method: degraded (spawn_agent unavailable in this session)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Estados de carregamento e transições normais, sem indicadores complexos. |
| 2 | Match System / Real World | 4 | Vocabulário e tom muito adequados ao nicho de ecoturismo e aventura. |
| 3 | User Control and Freedom | 4 | Fluxo de navegação claro e suporte adequado para controle de ações. |
| 4 | Consistency and Standards | 3 | Desalinhamento entre cores do arquivo `styles.css` (Burnt Orange/Sage) e os tokens de `DESIGN.md` (Forest Green/Vibrant Orange). |
| 5 | Error Prevention | 4 | n/a |
| 6 | Recognition Rather Than Recall | 4 | Excelente uso de ícones autoexplicativos com legendas textuais associadas. |
| 7 | Flexibility and Efficiency | 3 | Aceleradores comuns (como atalhos de teclado) ausentes na interface pública. |
| 8 | Aesthetic and Minimalist Design | 3 | Uso de slop de design comum como "eyebrows" em caixa alta em todas as seções e cartões excessivamente arredondados (`rounded-3xl`). |
| 9 | Error Recovery | 4 | n/a |
| 10 | Help and Documentation | 3 | O float de WhatsApp e os links do footer fornecem boas alternativas de ajuda. |
| **Total** | | **35/40** | **Good (minor polish)** |

## Anti-Patterns Verdict

**LLM assessment**: O design geral da página é visualmente forte devido ao excelente uso de imagens reais de aventura, mas apresenta alguns padrões típicos de geração por inteligência artificial ("AI slop"):
1. **Eyebrows repetitivos**: Todas as seções principais usam mini-títulos em caixa alta com espaçamento largo (`text-xs uppercase tracking-widest text-primary`) atuando como um scaffold genérico.
2. **Arredondamento excessivo**: Os blocos (como Pillars, Testimonials e Instagram CTA) usam `rounded-3xl` (24px), violando o limite de `rounded-md` (12px) estipulado no `DESIGN.md`.
3. **Métricas estilo SaaS**: O painel de estatísticas no rodapé da hero section segue a estrutura clichê de "número grande + etiqueta pequena", típica de dashboards corporativos SaaS, destoando do conceito de "Diário de Bordo do Explorador".

**Deterministic scan**: O scanner automatizado não detectou violações estáticas no arquivo `src/routes/index.tsx`.

## Overall Impression
A página inicial tem uma excelente fundação visual centrada em fotografia imersiva, mas sofre com o excesso de bordas arredondadas e pequenos "eyebrows" repetitivos que a fazem parecer um template genérico gerado por IA. O maior impacto virá de alinhar as cores de fundo e botões aos novos tokens de `DESIGN.md` e suavizar o estilo geométrico da interface.

## What's Working
- **Fotografia Imersiva**: O destaque dado a fotos reais de trekking estabelece conexão emocional imediata com a natureza.
- **Rápida Orientação**: O fluxo principal do usuário (encontrar expedições / reservar) é evidente logo na primeira dobra da página.

## Priority Issues

* **[P1] Cores desalinhadas com o Design System**
  * **Why it matters**: O botão principal "Reservar agora" usa fundo branco puro na hero e o tema geral está carregando a cor Burnt Orange do `styles.css` em vez do Forest Green e Vibrant Orange definidos em `DESIGN.md`.
  * **Fix**: Alterar os botões de ação primária para usar a cor de destaque Vibrant Orange (`bg-primary` se atualizado, ou o hex `#ff6b35`) e garantir a proporção máxima de 10% de cobertura.
  * **Suggested command**: `$impeccable colorize`

* **[P1] Eyebrows repetitivos em caixa alta**
  * **Why it matters**: O uso sistemático de kickers como "Próximas expedições", "A Dumas Trekk" e "Instagram" em todas as seções cansa visualmente e entrega o "grammar" sintático de gerações automáticas.
  * **Fix**: Remover ou variar os eyebrows. Substitua-os integrando o contexto no próprio título da seção ou use elementos tipográficos diferenciados (ex: números sequenciais com real propósito ou títulos de seção mais informativos).
  * **Suggested command**: `$impeccable typeset`

* **[P2] Cantos excessivamente arredondados**
  * **Why it matters**: A utilização de `rounded-3xl` (24px) nos pilares, depoimentos e CTA do Instagram quebra a seriedade e o tom técnico da marca, fazendo-a parecer infantilizada ou genérica.
  * **Fix**: Reduzir a curvatura dos cantos dos cards de `rounded-3xl` para `rounded-md` (12px), conforme o padrão geométrico estabelecido na especificação de design.
  * **Suggested command**: `$impeccable layout`

* **[P2] Visual SaaS do bloco de Estatísticas**
  * **Why it matters**: A barra na base da hero section com números em destaque se comporta como um dashboard de métricas corporativas, o que reduz o romantismo e autenticidade da expedição.
  * **Fix**: Integrar estes dados em um formato mais editorial, como uma frase curta descritiva contínua ou reduzir a proeminência visual do grid, focando na narrativa humana.
  * **Suggested command**: `$impeccable distill`

## Persona Red Flags

* **Jordan (First-Timer)**: Ao rolar a página em busca do manifesto de marca ("A Dumas Trekk"), a profusão de pequenos textos soltos ("Aventura com raiz, cuidado e propósito") misturados com um grid de fotos do Instagram sem indicação de legenda ou utilidade pode confundi-la quanto ao próximo passo real de engajamento.
* **Casey (Distracted Mobile User)**: As touch targets dos links rápidos nos cards de destinos (`DestinoCard`) e nos links de navegação secundária no manifesto precisam manter no mínimo `44x44px` de área clicável direta. O uso de links pequenos em texto corrido pode dificultar a navegação em telas móveis com uso de apenas uma mão.

## Minor Observations
- O gradiente de fundo no contêiner do Instagram (`from-forest-deep via-primary to-forest-moss`) quebra a regra de superfícies planas por padrão. Um fundo plano em Forest Green profundo com bordas geométricas e fotos integradas traria mais sofisticação.
