export interface Tpl {
  n: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Room layouts in unit coordinates; each set tiles the whole footprint. */
export const AGENCE: Tpl[] = [
  { n: 'Espace clients', x: 0, y: 0, w: 0.46, h: 0.55 },
  { n: 'Accueil', x: 0, y: 0.55, w: 0.46, h: 0.45 },
  { n: 'Bureaux commerciaux', x: 0.46, y: 0, w: 0.3, h: 0.4 },
  { n: 'Back-office', x: 0.46, y: 0.4, w: 0.3, h: 0.35 },
  { n: 'Sanitaires', x: 0.46, y: 0.75, w: 0.3, h: 0.25 },
  { n: 'Direction', x: 0.76, y: 0, w: 0.24, h: 0.4 },
  { n: 'Salle des coffres', x: 0.76, y: 0.4, w: 0.24, h: 0.3 },
  { n: 'Archives', x: 0.76, y: 0.7, w: 0.24, h: 0.3 },
];
export const IMMEUBLE: Tpl[] = [
  { n: 'Appartement A', x: 0, y: 0, w: 0.42, h: 0.5 },
  { n: 'Hall', x: 0.42, y: 0, w: 0.16, h: 0.35 },
  { n: 'Appartement B', x: 0.58, y: 0, w: 0.42, h: 0.5 },
  { n: 'Escalier', x: 0.42, y: 0.35, w: 0.16, h: 0.3 },
  { n: 'Appartement C', x: 0, y: 0.5, w: 0.42, h: 0.5 },
  { n: 'Local technique', x: 0.42, y: 0.65, w: 0.16, h: 0.35 },
  { n: 'Appartement D', x: 0.58, y: 0.5, w: 0.42, h: 0.5 },
];
export const VILLA: Tpl[] = [
  { n: 'Séjour', x: 0, y: 0, w: 0.5, h: 0.55 },
  { n: 'Cuisine', x: 0.5, y: 0, w: 0.25, h: 0.35 },
  { n: 'Salle à manger', x: 0.75, y: 0, w: 0.25, h: 0.35 },
  { n: 'Entrée', x: 0.5, y: 0.35, w: 0.15, h: 0.2 },
  { n: 'Escalier', x: 0.65, y: 0.35, w: 0.35, h: 0.2 },
  { n: 'Chambre 1', x: 0, y: 0.55, w: 0.3, h: 0.45 },
  { n: 'Chambre 2', x: 0.3, y: 0.55, w: 0.25, h: 0.45 },
  { n: 'Salle de bain', x: 0.55, y: 0.55, w: 0.2, h: 0.45 },
  { n: 'Suite parentale', x: 0.75, y: 0.55, w: 0.25, h: 0.45 },
];
export const ENTREPOT: Tpl[] = [
  { n: 'Hall de stockage', x: 0, y: 0, w: 0.78, h: 1 },
  { n: 'Quai', x: 0.78, y: 0, w: 0.22, h: 0.5 },
  { n: 'Bureau', x: 0.78, y: 0.5, w: 0.22, h: 0.3 },
  { n: 'Sanitaires', x: 0.78, y: 0.8, w: 0.22, h: 0.2 },
];

export const FLOORS: Record<string, number> = {
  Agence: 2,
  Siège: 8,
  'Immeuble de rapport': 4,
  'Logement de fonction': 2,
  Entrepôt: 1,
};

export function templateFor(nature: string): Tpl[] {
  return nature === 'Immeuble de rapport' ? IMMEUBLE : nature === 'Logement de fonction' ? VILLA : nature === 'Entrepôt' ? ENTREPOT : AGENCE;
}

/** Footprint of one floor in metres, from the total surface and the number of floors. */
export function footprint(surface: number, nature: string) {
  const floors = FLOORS[nature] ?? 2;
  const area = Math.max(60, surface / floors);
  const ratio = nature === 'Entrepôt' ? 2.2 : nature === 'Immeuble de rapport' ? 1.5 : 1.7;
  const wM = Math.sqrt(area * ratio);
  return { floors, wM, dM: area / wM };
}

