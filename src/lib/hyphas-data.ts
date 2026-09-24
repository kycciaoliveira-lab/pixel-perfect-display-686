import orquidea from "@/assets/orquidea.jpg";
import girassol from "@/assets/girassol.jpg";
import hibisco from "@/assets/hibisco.jpg";

export type Course = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  progress: number;
  level: string;
};

export const courses: Course[] = [
  {
    id: "tracos",
    title: "Fundamentos de Traço Botânico",
    description: "Linhas, proporção e estrutura de folhas e caules para quem está começando.",
    lessons: 12,
    progress: 75,
    level: "Iniciante",
  },
  {
    id: "petalas",
    title: "Sombra e Luz em Pétalas",
    description: "Volume, textura e degradês suaves em pétalas de orquídeas e hibiscos.",
    lessons: 9,
    progress: 40,
    level: "Iniciante",
  },
  {
    id: "aquarela",
    title: "Pintura em Aquarela Floral",
    description: "Camadas, aguadas e paleta tropical para ilustrações vibrantes.",
    lessons: 15,
    progress: 10,
    level: "Iniciante+",
  },
];

export type Artwork = {
  id: string;
  title: string;
  type: "Orquídea" | "Girassol" | "Hibisco";
  technique: string;
  image: string;
};

export const artworks: Artwork[] = [
  { id: "a1", title: "Phalaenopsis em magenta", type: "Orquídea", technique: "Aquarela", image: orquidea },
  { id: "a2", title: "Estudo de girassol", type: "Girassol", technique: "Grafite + aquarela", image: girassol },
  { id: "a3", title: "Hibisco rosa aberto", type: "Hibisco", technique: "Aquarela", image: hibisco },
  { id: "a4", title: "Folhas e raízes da orquídea", type: "Orquídea", technique: "Nanquim", image: orquidea },
  { id: "a5", title: "Pétala a pétala", type: "Girassol", technique: "Grafite", image: girassol },
  { id: "a6", title: "Paleta terracota", type: "Hibisco", technique: "Aquarela", image: hibisco },
];

export const guides = [
  { id: "g1", title: "Guia de traço — 10 exercícios diários", pages: 14 },
  { id: "g2", title: "Tabela de misturas de aquarela tropical", pages: 8 },
  { id: "g3", title: "Anatomia da flor para ilustradores", pages: 22 },
];
