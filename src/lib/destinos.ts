export type Destino = {
  slug: string;
  nome: string;
  local: string;
  estado: string;
  pais: string;
  imagem: string;
  nivel: "Fácil" | "Moderado" | "Difícil" | "Expedição";
  duracao: string;
  precoDesde: number;
  altitude: string;
  clima: string;
  tipo: "Trekking" | "Cachoeiras" | "Montanhismo" | "Acampamento";
  data: string;
  status: "Vagas abertas" | "Últimas vagas" | "Confirmada" | "Esgotada";
  descricao: string;
};

export const DESTINOS: Destino[] = [
  {
    slug: "chapada-diamantina",
    nome: "Travessia do Vale do Pati",
    local: "Chapada Diamantina",
    estado: "BA",
    pais: "Brasil",
    imagem: "/images/destino-chapada.jpg",
    nivel: "Moderado",
    duracao: "5 dias",
    precoDesde: 3890,
    altitude: "1.200 m",
    clima: "Ameno, 15–28°C",
    tipo: "Trekking",
    data: "12–16 Mar 2026",
    status: "Últimas vagas",
    descricao:
      "Uma das travessias mais icônicas do Brasil, passando por vales profundos, cachoeiras e comunidades tradicionais.",
  },
  {
    slug: "pico-da-neblina",
    nome: "Expedição Pico da Neblina",
    local: "Amazonas",
    estado: "AM",
    pais: "Brasil",
    imagem: "/images/destino-pico.jpg",
    nivel: "Expedição",
    duracao: "10 dias",
    precoDesde: 12490,
    altitude: "2.995 m",
    clima: "Úmido, 8–22°C",
    tipo: "Montanhismo",
    data: "05–14 Ago 2026",
    status: "Confirmada",
    descricao:
      "Ao ponto mais alto do Brasil em parceria com comunidades Yanomami. Uma imersão profunda na floresta e na cultura.",
  },
  {
    slug: "vale-cachoeiras",
    nome: "Vale das Cachoeiras",
    local: "Serra da Canastra",
    estado: "MG",
    pais: "Brasil",
    imagem: "/images/destino-cachoeira.jpg",
    nivel: "Fácil",
    duracao: "3 dias",
    precoDesde: 1990,
    altitude: "900 m",
    clima: "Ameno, 18–26°C",
    tipo: "Cachoeiras",
    data: "22–24 Abr 2026",
    status: "Vagas abertas",
    descricao:
      "Três dias entre quedas d'água imponentes, banhos gelados e trilhas suaves. Ideal para primeira aventura.",
  },
  {
    slug: "acampamento-estrelas",
    nome: "Acampamento sob as Estrelas",
    local: "Serra do Cipó",
    estado: "MG",
    pais: "Brasil",
    imagem: "/images/destino-acampamento.jpg",
    nivel: "Fácil",
    duracao: "2 dias",
    precoDesde: 1290,
    altitude: "1.100 m",
    clima: "Frio à noite, 5–24°C",
    tipo: "Acampamento",
    data: "15–16 Mai 2026",
    status: "Vagas abertas",
    descricao:
      "Fotografia noturna, fogueira e um dos céus mais límpidos do Sudeste. Perfeito para desconectar.",
  },
];
