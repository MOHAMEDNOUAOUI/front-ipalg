import { Col, ModuleDef, count, fmtCount, fmtMillions, sum, table } from '../module.types';

const NATURES = ['Agence', 'Siège', 'Immeuble de rapport', 'Logement de fonction', 'Terrain', 'Entrepôt'];
const VILLES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Oujda', 'Kénitra'];

const inventaireCols: Col[] = [
  { key: 'designation', label: 'Désignation', required: true },
  { key: 'code', label: 'Code', type: 'code' },
  { key: 'nature', label: 'Nature', options: NATURES },
  { key: 'ville', label: 'Ville', options: VILLES },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'surface', label: 'Surface (m²)', type: 'number' },
  { key: 'valeur', label: 'Valeur comptable', type: 'money' },
  { key: 'acquis', label: 'Date d’acquisition', type: 'date', drawerOnly: true },
  { key: 'titre', label: 'Titre foncier', type: 'code', drawerOnly: true },
  { key: 'notes', label: 'Observations', type: 'long', drawerOnly: true },
];

export const INVENTAIRE: ModuleDef = {
  key: 'inventaire',
  title: 'Base patrimoniale',
  subtitle: 'Tous les biens immobiliers de la banque, avec leur statut et leur valeur comptable',
  newLabel: 'Nouveau bien',
  titleKey: 'designation',
  statusKey: 'statut',
  documents: true,
  statuses: { 'En service': 'success', 'En projet': 'info', Loué: 'info', 'En litige': 'danger', 'À céder': 'warning' },
  cols: inventaireCols,
  rows: table(inventaireCols, [
    ['Agence Casablanca Maârif', 'BIEN-0001', 'Agence', 'Casablanca', 'En service', 420, 18_400_000, '2012-03-14', 'TF 118452/C', 'Façade rénovée en 2023.'],
    ['Siège social — Tour Bank of Africa', 'BIEN-0002', 'Siège', 'Casablanca', 'En service', 14200, 612_000_000, '2005-07-01', 'TF 45210/C', 'Inclut 3 niveaux de parking en sous-sol.'],
    ['Agence Rabat Agdal', 'BIEN-0003', 'Agence', 'Rabat', 'En service', 360, 14_900_000, '2014-09-22', 'TF 77219/R', ''],
    ['Immeuble Gauthier', 'BIEN-0004', 'Immeuble de rapport', 'Casablanca', 'Loué', 2650, 96_500_000, '2009-11-05', 'TF 90315/C', 'Loué à 4 locataires, bail commercial.'],
    ['Agence Marrakech Guéliz', 'BIEN-0005', 'Agence', 'Marrakech', 'En service', 390, 16_200_000, '2016-01-18', 'TF 32981/M', ''],
    ['Terrain Tamesna lot 14', 'BIEN-0006', 'Terrain', 'Rabat', 'En projet', 5200, 31_800_000, '2021-06-30', 'TF 201774/R', 'Projet de centre de formation à l’étude.'],
    ['Agence Tanger Centre', 'BIEN-0007', 'Agence', 'Tanger', 'En service', 310, 11_300_000, '2013-05-09', 'TF 55012/T', ''],
    ['Villa de fonction Anfa', 'BIEN-0008', 'Logement de fonction', 'Casablanca', 'En litige', 540, 22_700_000, '2007-02-27', 'TF 13340/C', 'Contestation de limite de propriété avec le voisin.'],
    ['Agence Fès Atlas', 'BIEN-0009', 'Agence', 'Fès', 'En service', 280, 8_700_000, '2011-10-12', 'TF 66401/F', ''],
    ['Entrepôt archives Ain Sebaâ', 'BIEN-0010', 'Entrepôt', 'Casablanca', 'À céder', 1800, 9_400_000, '2004-04-03', 'TF 87123/C', 'Cession approuvée en commission, en attente du notaire.'],
    ['Agence Agadir Founty', 'BIEN-0011', 'Agence', 'Agadir', 'En service', 340, 10_800_000, '2015-12-01', 'TF 40877/A', ''],
    ['Immeuble Habous Oujda', 'BIEN-0012', 'Immeuble de rapport', 'Oujda', 'Loué', 1450, 24_600_000, '2010-08-19', 'TF 29004/O', ''],
    ['Agence Kénitra Mehdia', 'BIEN-0013', 'Agence', 'Kénitra', 'En service', 295, 7_900_000, '2018-03-26', 'TF 71156/K', ''],
    ['Terrain Bouskoura', 'BIEN-0014', 'Terrain', 'Casablanca', 'En projet', 8400, 54_000_000, '2022-09-15', 'TF 244871/C', 'Réquisition en cours.'],
  ]),
  kpis: [
    { label: 'Biens recensés', value: (r) => fmtCount(r.length), detail: (r) => `${count(r, 'statut', 'En service')} en service` },
    { label: 'Valeur comptable', value: (r) => fmtMillions(sum(r, 'valeur')), detail: () => 'Valeur nette totale' },
    { label: 'Surface totale', value: (r) => `${fmtCount(sum(r, 'surface'))} m²` },
    { label: 'En litige ou à céder', value: (r) => fmtCount(count(r, 'statut', 'En litige', 'À céder')), detail: () => 'À suivre' },
  ],
};

const propCols: Col[] = [
  { key: 'objet', label: 'Objet', required: true },
  { key: 'ref', label: 'Référence', type: 'code' },
  { key: 'type', label: 'Type', options: ['Acquisition', 'Location'] },
  { key: 'ville', label: 'Ville', options: VILLES },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'prix', label: 'Prix proposé', type: 'money' },
  { key: 'date', label: 'Date de dépôt', type: 'date' },
  { key: 'notes', label: 'Évaluation de la commission', type: 'long', drawerOnly: true },
];

export const PROPOSITIONS: ModuleDef = {
  key: 'patrimoine/propositions',
  title: 'Propositions',
  subtitle: 'Biens à acquérir ou à louer, évalués puis validés par la commission',
  newLabel: 'Nouvelle proposition',
  titleKey: 'objet',
  statusKey: 'statut',
  statuses: { Brouillon: 'neutral', 'En évaluation': 'info', 'En commission': 'warning', Validée: 'success', Rejetée: 'danger' },
  stages: ['Brouillon','En évaluation','En commission','Validée'],
  cols: propCols,
  rows: table(propCols, [
    ['Local commercial Boulevard Zerktouni', 'PRP-2026-041', 'Location', 'Casablanca', 'En commission', 38_000, '2026-10-02', 'Emplacement très bien desservi, loyer supérieur au marché de 6 %.'],
    ['Terrain 1 200 m² Hay Riad', 'PRP-2026-040', 'Acquisition', 'Rabat', 'En évaluation', 14_400_000, '2026-09-28', ''],
    ['Plateau bureaux Technopolis', 'PRP-2026-039', 'Location', 'Rabat', 'Validée', 52_000, '2026-09-15', 'Validée à l’unanimité, bail de 9 ans.'],
    ['Immeuble R+4 Centre-ville Fès', 'PRP-2026-038', 'Acquisition', 'Fès', 'Rejetée', 22_800_000, '2026-09-04', 'Prix jugé trop élevé par rapport à l’expertise.'],
    ['Agence Guéliz extension', 'PRP-2026-037', 'Location', 'Marrakech', 'Validée', 21_500, '2026-08-27', ''],
    ['Villa à usage de bureaux Agdal', 'PRP-2026-036', 'Acquisition', 'Rabat', 'En commission', 18_900_000, '2026-08-19', ''],
    ['Local agence Tanger Marina', 'PRP-2026-035', 'Location', 'Tanger', 'En évaluation', 29_000, '2026-08-11', ''],
    ['Parcelle Bouskoura lot 8', 'PRP-2026-034', 'Acquisition', 'Casablanca', 'Brouillon', 9_600_000, '2026-08-01', ''],
    ['Entrepôt logistique Nouaceur', 'PRP-2026-033', 'Location', 'Casablanca', 'Validée', 44_000, '2026-07-22', ''],
    ['Local Agadir Talborjt', 'PRP-2026-032', 'Location', 'Agadir', 'Rejetée', 17_000, '2026-07-09', 'Surface insuffisante pour le programme.'],
  ]),
  kpis: [
    { label: 'Propositions', value: (r) => fmtCount(r.length) },
    { label: 'En commission', value: (r) => fmtCount(count(r, 'statut', 'En commission')), detail: () => 'Décision attendue' },
    { label: 'Validées', value: (r) => fmtCount(count(r, 'statut', 'Validée')) },
    { label: 'Taux de validation', value: (r) => `${fmtCount(Math.round((count(r, 'statut', 'Validée') / Math.max(1, count(r, 'statut', 'Validée', 'Rejetée'))) * 100))} %`, detail: () => 'Parmi les dossiers tranchés' },
  ],
};

const acqCols: Col[] = [
  { key: 'bien', label: 'Bien', required: true },
  { key: 'contrat', label: 'Contrat', type: 'code' },
  { key: 'proprietaire', label: 'Propriétaire' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'prix', label: 'Prix d’acquisition', type: 'money' },
  { key: 'signature', label: 'Signature', type: 'date' },
  { key: 'paiement', label: 'Paiement', options: ['Non réglé', 'Acompte versé', 'Soldé'], drawerOnly: true },
  { key: 'notes', label: 'Observations', type: 'long', drawerOnly: true },
];

export const ACQUISITIONS: ModuleDef = {
  key: 'patrimoine/acquisitions',
  title: 'Acquisitions',
  subtitle: 'Contrats, propriétaires, enregistrement et paiement de chaque acquisition',
  newLabel: 'Nouvelle acquisition',
  titleKey: 'bien',
  documents: true,
  statusKey: 'statut',
  statuses: { 'Promesse signée': 'info', 'Chez le notaire': 'warning', Enregistrée: 'info', Payée: 'success', Annulée: 'danger' },
  stages: ['Promesse signée','Chez le notaire','Enregistrée','Payée'],
  cols: acqCols,
  rows: table(acqCols, [
    ['Terrain Bouskoura', 'ACQ-2022-009', 'Société Bouskoura Invest', 'Payée', 54_000_000, '2022-09-15', 'Soldé', ''],
    ['Terrain Tamesna lot 14', 'ACQ-2021-014', 'M. Tazi', 'Payée', 31_800_000, '2021-06-30', 'Soldé', ''],
    ['Immeuble Maarif Extension', 'ACQ-2026-003', 'SCI Les Jardins', 'Chez le notaire', 41_500_000, '2026-09-18', 'Acompte versé', 'Acte définitif prévu en novembre.'],
    ['Local agence Salé', 'ACQ-2026-002', 'Mme Benjelloun', 'Enregistrée', 6_200_000, '2026-08-05', 'Acompte versé', ''],
    ['Parcelle Technopolis 3', 'ACQ-2026-001', 'Fondation Al Omrane', 'Promesse signée', 12_700_000, '2026-07-12', 'Non réglé', ''],
    ['Immeuble Habous Oujda', 'ACQ-2010-006', 'Habous Oujda', 'Payée', 24_600_000, '2010-08-19', 'Soldé', ''],
    ['Villa Anfa', 'ACQ-2007-002', 'M. Lahlou', 'Payée', 22_700_000, '2007-02-27', 'Soldé', 'Bien désormais en litige.'],
    ['Lot industriel Berrechid', 'ACQ-2025-011', 'Société Atlas Foncier', 'Annulée', 8_900_000, '2025-11-03', 'Non réglé', 'Annulée : titre foncier non purgé.'],
  ]),
  kpis: [
    { label: 'Acquisitions', value: (r) => fmtCount(r.length) },
    { label: 'En cours', value: (r) => fmtCount(count(r, 'statut', 'Promesse signée', 'Chez le notaire', 'Enregistrée')) },
    { label: 'Montant engagé', value: (r) => fmtMillions(sum(r, 'prix', (x) => x['statut'] !== 'Annulée')) },
    { label: 'Montant en cours', value: (r) => fmtMillions(sum(r, 'prix', (x) => ['Promesse signée', 'Chez le notaire', 'Enregistrée'].includes(String(x['statut'])))) },
  ],
};

const reqCols: Col[] = [
  { key: 'bien', label: 'Terrain', required: true },
  { key: 'ref', label: 'Dossier', type: 'code' },
  { key: 'conservation', label: 'Conservation foncière', options: ['Casablanca-Anfa', 'Rabat', 'Nouaceur', 'Médiouna', 'Marrakech'] },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'depot', label: 'Demande déposée', type: 'date' },
  { key: 'bornage', label: 'Bornage prévu', type: 'date' },
  { key: 'notes', label: 'Observations', type: 'long', drawerOnly: true },
];

export const REQUISITIONS: ModuleDef = {
  key: 'patrimoine/requisitions',
  title: 'Réquisitions',
  subtitle: 'Demande, publication, affichage et création du titre foncier',
  newLabel: 'Nouvelle réquisition',
  titleKey: 'bien',
  documents: true,
  statusKey: 'statut',
  statuses: { Déposée: 'neutral', 'Publiée au bulletin': 'info', 'Affichage en cours': 'info', 'Opposition reçue': 'danger', 'Titre créé': 'success' },
  stages: ['Déposée','Publiée au bulletin','Affichage en cours','Titre créé'],
  cols: reqCols,
  rows: table(reqCols, [
    ['Terrain Bouskoura', 'REQ-2026-007', 'Médiouna', 'Affichage en cours', '2026-05-12', '2026-11-18', 'Bornage contradictoire convoqué.'],
    ['Parcelle Technopolis 3', 'REQ-2026-006', 'Rabat', 'Publiée au bulletin', '2026-07-30', '2026-12-04', ''],
    ['Lot Nouaceur 21', 'REQ-2026-005', 'Nouaceur', 'Opposition reçue', '2026-03-09', '2026-10-30', 'Opposition d’un riverain, délai de 2 mois pour régulariser.'],
    ['Terrain Tamesna lot 15', 'REQ-2025-012', 'Rabat', 'Titre créé', '2025-02-17', '2025-06-10', ''],
    ['Parcelle Dar Bouazza', 'REQ-2026-004', 'Casablanca-Anfa', 'Déposée', '2026-09-21', '2027-01-15', ''],
    ['Terrain Marrakech Targa', 'REQ-2025-010', 'Marrakech', 'Titre créé', '2025-01-08', '2025-05-02', ''],
  ]),
  kpis: [
    { label: 'Réquisitions', value: (r) => fmtCount(r.length) },
    { label: 'En cours', value: (r) => fmtCount(count(r, 'statut', 'Déposée', 'Publiée au bulletin', 'Affichage en cours')) },
    { label: 'Oppositions', value: (r) => fmtCount(count(r, 'statut', 'Opposition reçue')), detail: () => 'À traiter en priorité' },
    { label: 'Titres créés', value: (r) => fmtCount(count(r, 'statut', 'Titre créé')) },
  ],
};

const litCols: Col[] = [
  { key: 'objet', label: 'Litige', required: true },
  { key: 'ref', label: 'Dossier', type: 'code' },
  { key: 'bien', label: 'Bien concerné' },
  { key: 'tribunal', label: 'Tribunal', options: ['TPI Casablanca', 'TPI Rabat', 'Tribunal de commerce', 'Cour d’appel Casablanca', 'TPI Marrakech'] },
  { key: 'avocat', label: 'Avocat' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'enjeu', label: 'Enjeu financier', type: 'money' },
  { key: 'audience', label: 'Prochaine audience', type: 'date' },
  { key: 'notes', label: 'Historique', type: 'long', drawerOnly: true },
];

export const LITIGES: ModuleDef = {
  key: 'patrimoine/litiges',
  title: 'Litiges',
  subtitle: 'Litiges liés à un bien ou à une procédure, avec avocat et tribunal',
  newLabel: 'Nouveau litige',
  titleKey: 'objet',
  statusKey: 'statut',
  statuses: { Ouvert: 'warning', 'En instruction': 'info', 'En appel': 'info', Jugé: 'neutral', Clos: 'success' },
  stages: ['Ouvert','En instruction','En appel','Jugé','Clos'],
  cols: litCols,
  rows: table(litCols, [
    ['Bornage contesté Anfa', 'LIT-2026-006', 'Villa de fonction Anfa', 'TPI Casablanca', 'Me Alaoui', 'En instruction', 3_200_000, '2026-11-12', 'Expertise judiciaire ordonnée le 3 septembre.'],
    ['Impayés de loyers — Immeuble Gauthier', 'LIT-2026-005', 'Immeuble Gauthier', 'Tribunal de commerce', 'Me Benkirane', 'Ouvert', 780_000, '2026-11-24', ''],
    ['Opposition à la réquisition Nouaceur', 'LIT-2026-004', 'Lot Nouaceur 21', 'TPI Casablanca', 'Me Alaoui', 'Ouvert', 1_900_000, '2026-12-03', ''],
    ['Résiliation bail agence Tanger', 'LIT-2026-003', 'Agence Tanger Centre', 'TPI Rabat', 'Me Chraibi', 'En appel', 1_150_000, '2027-01-20', 'Jugement de première instance favorable à la banque.'],
    ['Servitude de passage Agdal', 'LIT-2025-011', 'Agence Rabat Agdal', 'TPI Rabat', 'Me Chraibi', 'Jugé', 240_000, '', 'Jugement du 12 juin, délai d’appel expiré.'],
    ['Malfaçons agence Marrakech', 'LIT-2025-009', 'Agence Marrakech Guéliz', 'TPI Marrakech', 'Me Idrissi', 'Clos', 460_000, '', 'Transaction signée avec l’entreprise.'],
    ['Occupation sans titre Oujda', 'LIT-2026-002', 'Immeuble Habous Oujda', 'TPI Casablanca', 'Me Benkirane', 'En instruction', 620_000, '2026-11-30', ''],
  ]),
  kpis: [
    { label: 'Dossiers ouverts', value: (r) => fmtCount(r.filter((x) => !['Clos', 'Jugé'].includes(String(x['statut']))).length) },
    { label: 'Enjeu financier', value: (r) => fmtMillions(sum(r, 'enjeu', (x) => x['statut'] !== 'Clos')), detail: () => 'Hors dossiers clos' },
    { label: 'En appel', value: (r) => fmtCount(count(r, 'statut', 'En appel')) },
    { label: 'Dossiers clos', value: (r) => fmtCount(count(r, 'statut', 'Clos')) },
  ],
};

const cesCols: Col[] = [
  { key: 'bien', label: 'Bien cédé', required: true },
  { key: 'ref', label: 'Dossier', type: 'code' },
  { key: 'acheteur', label: 'Acquéreur' },
  { key: 'notaire', label: 'Notaire' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'vnc', label: 'Valeur nette comptable', type: 'money' },
  { key: 'prix', label: 'Prix de cession', type: 'money' },
  { key: 'date', label: 'Date prévue', type: 'date' },
  { key: 'notes', label: 'Observations', type: 'long', drawerOnly: true },
];

export const CESSIONS: ModuleDef = {
  key: 'patrimoine/cessions',
  title: 'Cessions',
  subtitle: 'Sorties de biens : valeur de sortie, notaire, taxes et procès-verbal de cession',
  newLabel: 'Nouvelle cession',
  titleKey: 'bien',
  statusKey: 'statut',
  statuses: { 'En préparation': 'neutral', Approuvée: 'info', 'Chez le notaire': 'warning', Réalisée: 'success', Annulée: 'danger' },
  stages: ['En préparation','Approuvée','Chez le notaire','Réalisée'],
  cols: cesCols,
  rows: table(cesCols, [
    ['Entrepôt archives Ain Sebaâ', 'CES-2026-004', 'Société Logistica', 'Me Tahiri', 'Chez le notaire', 9_400_000, 11_200_000, '2026-11-20', 'Plus-value de 1,8 M MAD à constater.'],
    ['Local Berrechid', 'CES-2026-003', 'M. El Fassi', 'Me Tahiri', 'Approuvée', 2_100_000, 1_850_000, '2026-12-10', 'Moins-value acceptée par la commission.'],
    ['Villa Souissi', 'CES-2026-002', 'Mme Berrada', 'Me Kettani', 'En préparation', 15_600_000, 17_000_000, '2027-01-15', ''],
    ['Agence Settat (ancienne)', 'CES-2025-008', 'Commune de Settat', 'Me Kettani', 'Réalisée', 3_800_000, 4_100_000, '2025-12-05', ''],
    ['Parcelle Ain Harouda', 'CES-2025-006', 'Société Immo Atlas', 'Me Tahiri', 'Réalisée', 5_200_000, 5_200_000, '2025-09-18', ''],
    ['Appartement Maârif 4B', 'CES-2026-001', 'M. Slaoui', 'Me Kettani', 'Annulée', 2_900_000, 2_700_000, '2026-04-30', 'Acquéreur défaillant.'],
  ]),
  kpis: [
    { label: 'Cessions', value: (r) => fmtCount(r.length) },
    { label: 'En cours', value: (r) => fmtCount(count(r, 'statut', 'En préparation', 'Approuvée', 'Chez le notaire')) },
    { label: 'Produit de cession', value: (r) => fmtMillions(sum(r, 'prix', (x) => x['statut'] === 'Réalisée')), detail: () => 'Cessions réalisées' },
    { label: 'Plus-value nette', value: (r) => fmtMillions(sum(r, 'prix', (x) => x['statut'] === 'Réalisée') - sum(r, 'vnc', (x) => x['statut'] === 'Réalisée')) },
  ],
};
