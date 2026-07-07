---
name: "DumasTrekk"
description: "Expedições de trekking e ecoturismo premium"
colors:
  primary: "#1d3527"
  secondary: "#553c2b"
  accent: "#ff6b35"
  neutral-bg: "#f9f7f2"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "#e0531b"
---

# Design System: DumasTrekk

## 1. Overview

**Creative North Star: "O Diário de Bordo do Explorador"**

O DumasTrekk possui um visual limpo e autêntico, com tipografia clássica e moderna de alta legibilidade, com grande destaque para fotografia de aventuras reais e conteúdos de ecoturismo premium. O design serve para transmitir segurança, exclusividade e contato genuíno com a natureza, evitando excessos de decorações e clichês visuais artificiais.

**Key Characteristics:**
- Foco em fotografia imersiva de alta qualidade de aventuras reais.
- Tipografia moderna e estruturada baseada na fonte Inter com contrastes em Fraunces.
- Estrutura limpa e organizada, com superfícies planas por padrão.

## 2. Colors

A paleta é baseada nos tons terrosos e florestais da natureza, guiando o olhar do usuário com foco absoluto através de um ponto de contraste vibrante.

### Primary
- **Forest Green** (#1d3527): Representa a mata densa e a seriedade técnica. Utilizado para títulos principais de páginas, backgrounds contrastantes e textos escuros sobre fundo claro.

### Secondary
- **Earth Brown** (#553c2b): Representa as trilhas e a terra. Usado para subtextos, elementos secundários e detalhes que exigem conexão natural.

### Neutral
- **Background Cream** (#f9f7f2): O fundo principal da aplicação, trazendo sensação de papel e diário de bordo sob luz natural.
- **Charcoal** (#1f1e1b): Texto principal para máxima legibilidade contra o fundo creme.

### Named Rules
**The 10% Accent Rule.** A cor de destaque Laranja Vibrante (#ff6b35) deve cobrir no máximo 10% de qualquer tela. Ele atua como o guia de foco absoluto do usuário para botões de conversão e elementos críticos de ação.

## 3. Typography

**Display Font:** Fraunces (serif)
**Body Font:** Inter (sans-serif)

A tipografia une a modernidade e legibilidade da Inter nos corpos de texto com o charme tradicional e editorial da Fraunces nos títulos principais, evocando um livro de memórias ou diário de bordo de exploração.

### Hierarchy
- **Display** (600, clamp(2.5rem, 6vw, 4rem), 1.1): Títulos principais de páginas e destinos.
- **Headline** (600, 2rem, 1.2): Títulos de seções secundárias.
- **Title** (500, 1.25rem, 1.3): Títulos de cards e agrupamentos.
- **Body** (400, 1rem, 1.5): Textos descritivos e roteiros informativos (máx. 75 caracteres por linha).
- **Label** (500, 0.875rem, normal): Botões, badges, metadados e legendas.

## 4. Elevation

O sistema preza pelo minimalismo e pela estrutura plana por padrão. As sombras não são elementos decorativos fixos, mas sinalizadores de interação ativa.

### Named Rules
**The Flat-By-Default Rule.** Superfícies são representadas de forma plana. Sombras só surgem como feedback dinâmico a ações de hover e foco do usuário.

## 5. Components

### Buttons
- **Shape:** Cantos suavizados geométricos (6px / rounded-sm)
- **Primary:** Laranja Vibrante (#ff6b35) com texto branco. Padding de 10px 20px.
- **Hover / Focus:** Transição de fundo para Laranja Escuro (#e0531b) com sombra sutil de interação ativa.

### Cards / Containers
- **Corner Style:** Bordas geométricas (12px / rounded-md)
- **Background:** Branco Puro ou Creme Suave.
- **Shadow Strategy:** Planos em repouso. No hover, ganham leve elevação dinâmica para denotar clique.

### Navigation
- **Style:** Links limpos e minimalistas, com transição de cor suave em hover. Mobile menu com suporte a fechamento simples via clique externo e tecla Escape.

## 6. Do's and Don'ts

### Do:
- **Do** Manter a proporção da regra de 10% para a cor de destaque Laranja Vibrante.
- **Do** Garantir contraste de texto mínimo de 4.5:1, utilizando Forest Green para textos sobre Background Cream.
- **Do** Limitar o comprimento de linha das descrições a no máximo 75 caracteres.

### Don't:
- **Don't** Usar gradientes coloridos ou degradês no texto de títulos.
- **Don't** Utilizar cantos arredondados excessivamente grandes (superiores a 16px) em cards ou contêineres principais.
- **Don't** Utilizar faixas de bordas laterais coloridas de destaque nos cards para sinalizar status ou categorias.
