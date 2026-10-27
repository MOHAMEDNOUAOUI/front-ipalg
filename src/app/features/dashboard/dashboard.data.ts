import { BarRow } from '../../components/charts/bar-list/bar-list';
import { Group, Series } from '../../components/charts/grouped-bars/grouped-bars';
import { Slice } from '../../components/charts/donut-chart/donut-chart';

/**
 * Demonstration data. No dashboard endpoint exists yet; the shapes below are what the
 * service should return once the backend exposes the indicators listed in the EDB
 * (gestion foncière, gestion locative, alertes).
 */

export const DEMO_ALERT_COUNT = 5;

/** Répartition des biens par statut. Sums to 1 248. */
export const BIENS_PAR_STATUT: Slice[] = [
  { label: 'En exploitation', value: 641, color: 'var(--chart-1)' },
  { label: 'Loués à des tiers', value: 212, color: 'var(--chart-2)' },
  { label: 'Hors exploitation', value: 247, color: 'var(--chart-3)' },
  { label: 'En cours d’acquisition', value: 58, color: 'var(--chart-4)' },
  { label: 'En cession ou en litige', value: 90, color: 'var(--chart-5)' },
];

/** Valeur comptable par nature, en millions de MAD. Sums to 3 620. */
export const VALEUR_PAR_NATURE: BarRow[] = [
  { label: 'Acquisition', value: 2410 },
  { label: 'Leasing', value: 480 },
  { label: 'Dation', value: 395 },
  { label: 'OPCI', value: 335 },
];

export const LOYERS_SERIES: Series[] = [
  { name: 'Recettes prévues (baux donnés)', color: 'var(--chart-1)' },
  { name: 'Dépenses prévues (baux pris)', color: 'var(--chart-2)' },
];

/** Loyers prévus par trimestre, en millions de MAD. */
export const LOYERS_PAR_TRIMESTRE: Group[] = [
  { label: 'T1', values: [18.4, 12.2] },
  { label: 'T2', values: [18.9, 12.2] },
  { label: 'T3', values: [19.6, 12.9] },
  { label: 'T4', values: [20.1, 13.4] },
];

export interface Kpi {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  /** Demo history, oldest first. */
  trend: number[];
  /** Whether a rise is good news. */
  better: 'up' | 'down';
}

export const KPIS: Kpi[] = [
  { label: 'Biens recensés', value: '1 248', detail: '212 loués à des tiers', trend: [1180, 1186, 1194, 1201, 1213, 1222, 1231, 1240, 1248], better: 'up' },
  { label: 'Valeur du patrimoine', value: '3,62', unit: 'Md MAD', detail: 'Valeur comptable', trend: [3.31, 3.34, 3.4, 3.39, 3.47, 3.52, 3.55, 3.59, 3.62], better: 'up' },
  { label: 'Baux actifs', value: '312', detail: '187 donnés, 125 pris', trend: [298, 301, 305, 304, 307, 309, 308, 311, 312], better: 'up' },
  { label: 'Alertes à traiter', value: String(DEMO_ALERT_COUNT), detail: '2 sont urgentes', trend: [3, 4, 4, 6, 5, 7, 6, 5, DEMO_ALERT_COUNT], better: 'down' },
];

/** Loyers encaissés et prévus par mois, en millions de MAD (neuf mois écoulés). */
export const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
export const ENCAISSE = [5.8, 6.0, 6.3, 6.1, 6.3, 6.5, 6.4, 6.6, 6.8];
export const PREVU = [6.1, 6.1, 6.1, 6.3, 6.3, 6.3, 6.5, 6.5, 6.5, 6.7, 6.7, 6.7];

export interface Echeance {
  objet: string;
  type: string;
  date: string;
  jours: number;
  montant: string;
  route: string;
}

export const ECHEANCES: Echeance[] = [
  { objet: 'Agence Casablanca Maârif', type: 'Fin de bail pris', date: '7 nov. 2026', jours: 12, montant: '48 000 MAD / mois', route: 'location/baux-pris' },
  { objet: 'Siège Rabat Agdal', type: 'Révision de loyer', date: '1 déc. 2026', jours: 36, montant: '212 500 MAD / mois', route: 'location/baux-donnes' },
  { objet: 'Immeuble Anfa Place', type: 'Fin d’amortissement', date: '30 nov. 2026', jours: 35, montant: '14,2 M MAD', route: 'finance/amortissements' },
  { objet: 'Local Tanger Marina', type: 'Assurance à renouveler', date: '15 déc. 2026', jours: 50, montant: '86 400 MAD / an', route: 'exploitation/maintenance' },
  { objet: 'Terrain Bouskoura', type: 'Taxe à régler', date: '31 déc. 2026', jours: 66, montant: '31 800 MAD', route: 'finance/amortissements' },
];

export interface Activite {
  who: string;
  initials: string;
  action: string;
  objet: string;
  when: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
  tag: string;
}

export const ACTIVITES: Activite[] = [
  { who: 'Salma Berrada', initials: 'SB', action: 'a validé la cession de', objet: 'Local Marrakech Guéliz', when: 'il y a 25 min', tone: 'success', tag: 'Validée' },
  { who: 'Youssef Idrissi', initials: 'YI', action: 'a déposé une réquisition pour', objet: 'Terrain Bouskoura, TF 48213/C', when: 'il y a 2 h', tone: 'info', tag: 'Déposée' },
  { who: 'Hajar Lahlou', initials: 'HL', action: 'a signé le bail de', objet: 'Agence Fès Atlas', when: 'hier, 16:40', tone: 'success', tag: 'Signé' },
  { who: 'Mohamed Nouaoui', initials: 'MN', action: 'a ouvert un litige sur', objet: 'Immeuble Casablanca Racine', when: 'hier, 11:05', tone: 'danger', tag: 'Litige' },
  { who: 'Salma Berrada', initials: 'SB', action: 'a planifié une maintenance sur', objet: 'Siège Rabat Agdal', when: 'lundi', tone: 'warning', tag: 'Planifiée' },
];

export type Urgency = 'urgent' | 'soon' | 'info';

export interface Todo {
  title: string;
  where: string;
  when: string;
  urgency: Urgency;
  icon: string;
  route: string;
}

export const TODOS: Todo[] = [
  {
    title: 'Bail pris à renouveler',
    where: 'Agence Casablanca Maârif',
    when: 'Échéance dans 12 jours',
    urgency: 'urgent',
    icon: 'tablerKey',
    route: 'location/baux-pris',
  },
  {
    title: 'Réquisition à clôturer',
    where: 'Terrain Bouskoura, TF 48213/C',
    when: 'En attente depuis 45 jours',
    urgency: 'urgent',
    icon: 'tablerMapPin',
    route: 'patrimoine/requisitions',
  },
  {
    title: 'Opération à valider',
    where: 'Cession du local Marrakech Guéliz',
    when: 'Chez l’approbateur depuis 6 jours',
    urgency: 'soon',
    icon: 'tablerArrowsExchange',
    route: 'patrimoine/cessions',
  },
  {
    title: 'Révision de loyer',
    where: 'Siège Rabat Agdal',
    when: 'Applicable au 1er décembre',
    urgency: 'soon',
    icon: 'tablerCalendarDue',
    route: 'location/baux-donnes',
  },
  {
    title: 'Fin d’amortissement',
    where: 'Immeuble Anfa Place',
    when: 'Le 30 novembre 2026',
    urgency: 'info',
    icon: 'tablerCalculator',
    route: 'finance/amortissements',
  },
];

/** Biens loués à des tiers : 212, dont le détail ci-dessous. */
export const OCCUPATION = {
  taux: 77,
  parts: [
    { label: 'Occupés', value: 164, color: 'var(--chart-1)' },
    { label: 'Vacants', value: 36, color: 'var(--chart-2)' },
    { label: 'En travaux', value: 12, color: 'var(--chart-5)' },
  ],
};

/** Valeur comptable par ville, en millions de MAD. Sums to 3 620. */
export const VALEUR_PAR_VILLE = [
  { label: 'Casablanca', value: 1480 },
  { label: 'Rabat', value: 760 },
  { label: 'Marrakech', value: 410 },
  { label: 'Tanger', value: 330 },
  { label: 'Fès', value: 240 },
  { label: 'Agadir', value: 190 },
  { label: 'Oujda', value: 110 },
  { label: 'Kénitra', value: 100 },
];

/** Échéances des douze prochains mois, par nature. */
export const ECH_MOIS = ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct'];
export const ECH_STACKS = [
  { name: 'Baux', color: 'var(--chart-1)', values: [3, 2, 4, 1, 2, 3, 2, 1, 3, 2, 1, 2] },
  { name: 'Révisions de loyer', color: 'var(--chart-2)', values: [1, 2, 0, 1, 1, 2, 1, 0, 1, 1, 2, 0] },
  { name: 'Assurances et taxes', color: 'var(--chart-4)', values: [2, 1, 3, 0, 1, 0, 2, 1, 0, 2, 1, 1] },
];

export interface Etape {
  label: string;
  n: number;
  note: string;
  route: string;
}

export const OPERATIONS: Etape[] = [
  { label: 'Propositions', n: 14, note: '3 en commission', route: 'patrimoine/propositions' },
  { label: 'Acquisitions', n: 9, note: '2 chez le notaire', route: 'patrimoine/acquisitions' },
  { label: 'Réquisitions', n: 6, note: '1 opposition reçue', route: 'patrimoine/requisitions' },
  { label: 'Cessions', n: 4, note: '1 à valider', route: 'patrimoine/cessions' },
  { label: 'Litiges', n: 3, note: '1 en appel', route: 'patrimoine/litiges' },
];
