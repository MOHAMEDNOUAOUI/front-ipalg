import { Col, ModuleDef, count, fmtCount, table } from '../module.types';

const gedCols: Col[] = [
  { key: 'titre', label: 'Document', required: true },
  { key: 'ref', label: 'Référence', type: 'code' },
  { key: 'type', label: 'Type', options: ['Titre foncier', 'Contrat de bail', 'Acte de vente', 'Plan', 'Autorisation', 'Expertise', 'PV de réception'] },
  { key: 'bien', label: 'Bien rattaché' },
  { key: 'version', label: 'Version', type: 'code' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'date', label: 'Ajouté le', type: 'date' },
  { key: 'notes', label: 'Historique des versions', type: 'long', drawerOnly: true },
];

export const GED: ModuleDef = {
  key: 'ged',
  title: 'Base documentaire',
  subtitle: 'Actes, plans, contrats et autorisations rattachés aux biens, avec versions',
  newLabel: 'Ajouter un document',
  titleKey: 'titre',
  statusKey: 'statut',
  statuses: { Valide: 'success', 'À vérifier': 'warning', Expiré: 'danger', Archivé: 'neutral' },
  cols: gedCols,
  rows: table(gedCols, [
    ['Titre foncier TF 45210/C', 'DOC-00412', 'Titre foncier', 'Siège social — Tour Bank of Africa', 'v2', 'Valide', '2024-02-11', 'v1 : copie scannée. v2 : certificat de propriété à jour.'],
    ['Bail Fidaroc plateau 1', 'DOC-00898', 'Contrat de bail', 'Immeuble Gauthier — plateau 1', 'v1', 'Valide', '2021-03-02', ''],
    ['Plans d’exécution agence Maârif', 'DOC-01103', 'Plan', 'Agence Casablanca Maârif', 'v4', 'Valide', '2026-07-19', 'v4 : plans modifiés après relevé sur site.'],
    ['Autorisation de construire Tamesna', 'DOC-01240', 'Autorisation', 'Terrain Tamesna lot 14', 'v1', 'À vérifier', '2026-08-30', 'Date de validité à confirmer auprès de la commune.'],
    ['Acte de vente Bouskoura', 'DOC-00955', 'Acte de vente', 'Terrain Bouskoura', 'v1', 'Valide', '2022-09-20', ''],
    ['Expertise Immeuble Gauthier 2026', 'DOC-01311', 'Expertise', 'Immeuble Gauthier', 'v1', 'Valide', '2026-09-08', ''],
    ['Permis d’habiter agence Fès', 'DOC-00644', 'Autorisation', 'Agence Fès Atlas', 'v1', 'Expiré', '2011-11-03', 'Renouvellement demandé.'],
    ['PV de réception Technopolis', 'DOC-01329', 'PV de réception', 'Nouvelle agence Technopolis', 'v2', 'À vérifier', '2026-10-14', 'v2 : réserves ajoutées après visite du 12 octobre.'],
    ['Titre foncier TF 118452/C', 'DOC-00221', 'Titre foncier', 'Agence Casablanca Maârif', 'v1', 'Valide', '2012-03-20', ''],
    ['Ancien bail agence Agadir', 'DOC-00510', 'Contrat de bail', 'Agence Agadir Talborjt', 'v3', 'Archivé', '2016-02-01', ''],
  ]),
  kpis: [
    { label: 'Documents', value: (r) => fmtCount(r.length) },
    { label: 'Valides', value: (r) => fmtCount(count(r, 'statut', 'Valide')) },
    { label: 'À vérifier', value: (r) => fmtCount(count(r, 'statut', 'À vérifier')), detail: () => 'Contrôle humain requis' },
    { label: 'Expirés', value: (r) => fmtCount(count(r, 'statut', 'Expiré')), detail: () => 'À renouveler' },
  ],
};

const fouCols: Col[] = [
  { key: 'nom', label: 'Fournisseur', required: true },
  { key: 'code', label: 'Code', type: 'code' },
  { key: 'categorie', label: 'Catégorie', options: ['Maintenance', 'Travaux', 'Notariat', 'Expertise', 'Sécurité', 'Juridique'] },
  { key: 'ville', label: 'Ville' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'contact', label: 'Contact', drawerOnly: true },
  { key: 'ice', label: 'ICE', type: 'code', drawerOnly: true },
  { key: 'sync', label: 'Dernière synchronisation', type: 'date' },
];

export const FOURNISSEURS: ModuleDef = {
  key: 'administration/fournisseurs',
  title: 'Fournisseurs',
  subtitle: 'Référentiel des fournisseurs, synchronisé avec le système fournisseurs',
  newLabel: 'Nouveau fournisseur',
  titleKey: 'nom',
  statusKey: 'statut',
  statuses: { Actif: 'success', 'En revue': 'warning', Bloqué: 'danger' },
  cols: fouCols,
  rows: table(fouCols, [
    ['Climatech', 'FRN-0142', 'Maintenance', 'Casablanca', 'Actif', 'contact@climatech.ma', '001234567000041', '2026-10-25'],
    ['Otis Maroc', 'FRN-0031', 'Maintenance', 'Casablanca', 'Actif', 'service@otis.ma', '000987654000022', '2026-10-25'],
    ['Étanch Pro', 'FRN-0207', 'Travaux', 'Casablanca', 'Actif', 'devis@etanchpro.ma', '002345678000019', '2026-10-25'],
    ['SécuriFeu', 'FRN-0118', 'Sécurité', 'Rabat', 'Actif', 'contact@securifeu.ma', '001112223000055', '2026-10-25'],
    ['Me Tahiri — Notaire', 'FRN-0089', 'Notariat', 'Casablanca', 'Actif', 'etude.tahiri@notaires.ma', '000445566000013', '2026-10-24'],
    ['Me Kettani — Notaire', 'FRN-0090', 'Notariat', 'Rabat', 'Actif', 'etude.kettani@notaires.ma', '000778899000027', '2026-10-24'],
    ['Cabinet Expertim', 'FRN-0156', 'Expertise', 'Casablanca', 'En revue', 'direction@expertim.ma', '003344556000031', '2026-10-20'],
    ['AutoPorte', 'FRN-0233', 'Maintenance', 'Fès', 'Actif', 'sav@autoporte.ma', '004455667000048', '2026-10-25'],
    ['Brillance Services', 'FRN-0178', 'Maintenance', 'Casablanca', 'Bloqué', 'info@brillance.ma', '005566778000062', '2026-09-30'],
    ['Cabinet Alaoui & Associés', 'FRN-0067', 'Juridique', 'Casablanca', 'Actif', 'alaoui@avocats.ma', '000223344000074', '2026-10-24'],
  ]),
  kpis: [
    { label: 'Fournisseurs', value: (r) => fmtCount(r.length) },
    { label: 'Actifs', value: (r) => fmtCount(count(r, 'statut', 'Actif')) },
    { label: 'En revue', value: (r) => fmtCount(count(r, 'statut', 'En revue')) },
    { label: 'Bloqués', value: (r) => fmtCount(count(r, 'statut', 'Bloqué')) },
  ],
};

const entCols: Col[] = [
  { key: 'nom', label: 'Entité', required: true },
  { key: 'code', label: 'Code', type: 'code' },
  { key: 'type', label: 'Type', options: ['Siège', 'Direction régionale', 'Agence', 'Direction métier'] },
  { key: 'parent', label: 'Rattachée à' },
  { key: 'ville', label: 'Ville' },
  { key: 'utilisateurs', label: 'Utilisateurs', type: 'number' },
  { key: 'statut', label: 'Statut', type: 'status' },
];

export const ENTITES: ModuleDef = {
  key: 'administration/entites',
  title: 'Entités',
  subtitle: 'Entités de la banque et rattachement des utilisateurs',
  newLabel: 'Nouvelle entité',
  titleKey: 'nom',
  statusKey: 'statut',
  statuses: { Active: 'success', Fermée: 'neutral' },
  cols: entCols,
  rows: table(entCols, [
    ['Direction Générale', 'ENT-001', 'Siège', '—', 'Casablanca', 18, 'Active'],
    ['Direction du Patrimoine', 'ENT-014', 'Direction métier', 'Direction Générale', 'Casablanca', 14, 'Active'],
    ['Direction Régionale Casablanca', 'ENT-102', 'Direction régionale', 'Direction Générale', 'Casablanca', 9, 'Active'],
    ['Direction Régionale Nord', 'ENT-103', 'Direction régionale', 'Direction Générale', 'Tanger', 6, 'Active'],
    ['Direction Régionale Sud', 'ENT-104', 'Direction régionale', 'Direction Générale', 'Agadir', 5, 'Active'],
    ['Agence Casablanca Maârif', 'ENT-210', 'Agence', 'Direction Régionale Casablanca', 'Casablanca', 4, 'Active'],
    ['Agence Rabat Agdal', 'ENT-221', 'Agence', 'Direction Régionale Nord', 'Rabat', 3, 'Active'],
    ['Agence Marrakech Guéliz', 'ENT-240', 'Agence', 'Direction Régionale Sud', 'Marrakech', 3, 'Active'],
    ['Agence Settat (fermée)', 'ENT-231', 'Agence', 'Direction Régionale Casablanca', 'Settat', 0, 'Fermée'],
  ]),
  kpis: [
    { label: 'Entités', value: (r) => fmtCount(r.length) },
    { label: 'Actives', value: (r) => fmtCount(count(r, 'statut', 'Active')) },
    { label: 'Agences', value: (r) => fmtCount(count(r, 'type', 'Agence')) },
    { label: 'Utilisateurs rattachés', value: (r) => fmtCount(r.reduce((a, x) => a + Number(x['utilisateurs']), 0)) },
  ],
};

const audCols: Col[] = [
  { key: 'date', label: 'Date et heure', type: 'code' },
  { key: 'utilisateur', label: 'Utilisateur' },
  { key: 'action', label: 'Action', type: 'status' },
  { key: 'objet', label: 'Objet concerné' },
  { key: 'poste', label: 'Poste', type: 'code' },
  { key: 'avant', label: 'Ancienne valeur', drawerOnly: true },
  { key: 'apres', label: 'Nouvelle valeur', drawerOnly: true },
];

export const AUDIT: ModuleDef = {
  key: 'administration/audit',
  title: 'Journal d’audit',
  subtitle: 'Toutes les actions : utilisateur, poste, ancienne et nouvelle valeur, date',
  titleKey: 'objet',
  statusKey: 'action',
  statuses: { Création: 'success', Modification: 'info', Suppression: 'danger', Connexion: 'neutral', Export: 'warning' },
  cols: audCols,
  rows: table(audCols, [
    ['2026-10-26 09:41', 'S. Alaoui', 'Modification', 'Projet PRJ-2026-005', 'PC-DSI-0412', 'Avancement : 58 %', 'Avancement : 62 %'],
    ['2026-10-26 09:12', 'K. Berrada', 'Création', 'Proposition PRP-2026-041', 'PC-PAT-0107', '—', 'Local commercial Boulevard Zerktouni'],
    ['2026-10-26 08:55', 'Y. Tazi', 'Connexion', 'Session', 'PC-PAT-0233', '—', '—'],
    ['2026-10-25 17:30', 'M. Nouaoui', 'Export', 'Base patrimoniale', 'PC-DSI-0098', '—', '14 lignes exportées (CSV)'],
    ['2026-10-25 16:02', 'S. Alaoui', 'Modification', 'Ordre OM-2026-188', 'PC-DSI-0412', 'Statut : En cours', 'Statut : En attente de pièces'],
    ['2026-10-25 14:47', 'A. Idrissi', 'Suppression', 'Document DOC-01007', 'PC-JUR-0021', 'Plan provisoire v1', '—'],
    ['2026-10-25 11:20', 'K. Berrada', 'Modification', 'Bail BD-2019-009', 'PC-PAT-0107', 'Statut : Actif', 'Statut : À renouveler'],
    ['2026-10-24 15:08', 'M. Nouaoui', 'Création', 'Utilisateur n.benali', 'PC-DSI-0098', '—', 'Profil : Lecteur'],
    ['2026-10-24 10:33', 'Y. Tazi', 'Modification', 'Échéance BD-2025-004', 'PC-PAT-0233', 'Statut : À venir', 'Statut : En retard'],
    ['2026-10-23 18:01', 'A. Idrissi', 'Création', 'Litige LIT-2026-006', 'PC-JUR-0021', '—', 'Bornage contesté Anfa'],
  ]),
  kpis: [
    { label: 'Événements', value: (r) => fmtCount(r.length), detail: () => 'Sur les 4 derniers jours' },
    { label: 'Modifications', value: (r) => fmtCount(count(r, 'action', 'Modification')) },
    { label: 'Suppressions', value: (r) => fmtCount(count(r, 'action', 'Suppression')), detail: () => 'À contrôler' },
    { label: 'Utilisateurs actifs', value: (r) => fmtCount(new Set(r.map((x) => x['utilisateur'])).size) },
  ],
};

const champCols: Col[] = [
  { key: 'libelle', label: 'Champ', required: true },
  { key: 'code', label: 'Code technique', type: 'code' },
  { key: 'type', label: 'Type de donnée', options: ['Texte', 'Nombre', 'Date', 'Liste', 'Oui / Non'] },
  { key: 'module', label: 'Module', options: ['Base patrimoniale', 'Baux', 'Maintenance', 'Projets'] },
  { key: 'obligatoire', label: 'Saisie', options: ['Obligatoire', 'Facultative'] },
  { key: 'statut', label: 'Statut', type: 'status' },
];

export const CHAMPS: ModuleDef = {
  key: 'environement/champs-personalises',
  title: 'Champs personnalisés',
  subtitle: 'Champs supplémentaires par module',
  newLabel: 'Nouveau champ',
  titleKey: 'libelle',
  statusKey: 'statut',
  statuses: { Actif: 'success', Inactif: 'neutral' },
  cols: champCols,
  rows: table(champCols, [
    ['Référence cadastrale', 'ref_cadastre', 'Texte', 'Base patrimoniale', 'Facultative', 'Actif'],
    ['Classe énergétique', 'classe_energie', 'Liste', 'Base patrimoniale', 'Facultative', 'Actif'],
    ['Nombre de postes de travail', 'nb_postes', 'Nombre', 'Base patrimoniale', 'Facultative', 'Actif'],
    ['Indice de révision du loyer', 'indice_revision', 'Liste', 'Baux', 'Obligatoire', 'Actif'],
    ['Dépôt de garantie versé', 'depot_garantie', 'Oui / Non', 'Baux', 'Obligatoire', 'Actif'],
    ['Date de dernière visite technique', 'visite_technique', 'Date', 'Maintenance', 'Facultative', 'Actif'],
    ['Code ancien système', 'code_legacy', 'Texte', 'Base patrimoniale', 'Facultative', 'Inactif'],
  ]),
  kpis: [
    { label: 'Champs définis', value: (r) => fmtCount(r.length) },
    { label: 'Actifs', value: (r) => fmtCount(count(r, 'statut', 'Actif')) },
    { label: 'Obligatoires', value: (r) => fmtCount(count(r, 'obligatoire', 'Obligatoire')) },
  ],
};

const varCols: Col[] = [
  { key: 'nom', label: 'Variable', required: true },
  { key: 'cle', label: 'Clé', type: 'code' },
  { key: 'valeur', label: 'Valeur' },
  { key: 'categorie', label: 'Catégorie', options: ['Finance', 'Location', 'Alertes', 'Système'] },
  { key: 'modifie', label: 'Modifiée le', type: 'date' },
  { key: 'description', label: 'Description', type: 'long', drawerOnly: true },
];

export const VARIABLES: ModuleDef = {
  key: 'environement/variables-globales',
  title: 'Variables globales',
  subtitle: 'Paramètres métier utilisés par tous les modules',
  newLabel: 'Nouvelle variable',
  titleKey: 'nom',
  cols: varCols,
  rows: table(varCols, [
    ['Taux d’amortissement linéaire par défaut', 'amo.taux_lineaire', '4 %', 'Finance', '2026-01-10', 'Appliqué aux nouveaux actifs immobiliers sans taux spécifique.'],
    ['Taux de TVA applicable aux loyers', 'loc.tva', '10 %', 'Location', '2025-01-02', ''],
    ['Préavis alerte fin de bail', 'alt.preavis_bail', '90 jours', 'Alertes', '2026-03-15', 'Délai avant échéance à partir duquel une alerte est créée.'],
    ['Seuil de validation par la commission', 'pat.seuil_commission', '5 000 000 MAD', 'Finance', '2026-02-01', 'Au-delà, toute acquisition passe par la commission.'],
    ['Indice de révision des loyers', 'loc.indice', 'ICC trimestriel', 'Location', '2025-07-01', ''],
    ['Délai de relance loyer impayé', 'loc.relance_jours', '10 jours', 'Alertes', '2026-03-15', ''],
    ['Devise de référence', 'sys.devise', 'MAD', 'Système', '2024-01-01', ''],
  ]),
  kpis: [
    { label: 'Variables', value: (r) => fmtCount(r.length) },
    { label: 'Finance', value: (r) => fmtCount(count(r, 'categorie', 'Finance')) },
    { label: 'Alertes', value: (r) => fmtCount(count(r, 'categorie', 'Alertes')) },
  ],
};

// Value lists feed the dropdowns of every module, so adding a value here adds it everywhere.
const listCols: Col[] = [
  { key: 'nom', label: 'Liste', required: true },
  { key: 'code', label: 'Code', type: 'code' },
  { key: 'valeurs', label: 'Valeurs', type: 'number' },
  { key: 'usage', label: 'Alimente' },
  { key: 'statut', label: 'Statut', type: 'status' },
  { key: 'contenu', label: 'Valeurs de la liste (séparées par une virgule)', type: 'long', drawerOnly: true },
];

const valueLists: [string, string, string, string, string][] = [
  ['Types de bien', 'bien.type', 'Base patrimoniale', 'Active', 'Terrain, Immeuble, Agence, Villa, Appartement, Local commercial, Entrepôt'],
  ['Modes d’acquisition', 'acq.mode', 'Acquisitions', 'Active', 'Achat, Donation, Dation en paiement, Adjudication, Construction'],
  ['Natures de litige', 'lit.nature', 'Litiges', 'Active', 'Locatif, Foncier, Construction, Voisinage, Fiscal'],
  ['Types de bail', 'bail.type', 'Baux donnés, Baux pris', 'Active', 'Commercial, Habitation, Professionnel, Précaire'],
  ['Motifs de résiliation', 'bail.motif', 'Baux donnés', 'Active', 'Fin de contrat, Impayés, Cession du bien, Travaux, Accord amiable'],
  ['Statuts de maintenance', 'mnt.statut', 'Ordres de maintenance', 'Active', 'Ouvert, Planifié, En cours, Terminé, Annulé'],
  ['Villes', 'sys.ville', 'Tous les modules', 'Active', 'Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, Kénitra, Tétouan, Laâyoune'],
  ['Devises', 'sys.devise', 'Finance', 'Brouillon', 'MAD, EUR, USD'],
];

export const LISTES: ModuleDef = {
  key: 'environement/listes-valeurs',
  title: 'Listes de valeurs',
  subtitle: 'Les choix proposés dans les formulaires : types, statuts, villes, motifs',
  newLabel: 'Nouvelle liste',
  titleKey: 'nom',
  statusKey: 'statut',
  statuses: { Active: 'success', Brouillon: 'neutral' },
  cols: listCols,
  rows: table(
    listCols,
    valueLists.map(([nom, code, usage, statut, contenu]) => [
      nom,
      code,
      contenu.split(',').length,
      usage,
      statut,
      contenu,
    ])
  ),
  kpis: [
    { label: 'Listes', value: (r) => fmtCount(r.length) },
    { label: 'Valeurs au total', value: (r) => fmtCount(r.reduce((a, x) => a + Number(x['valeurs']), 0)) },
    { label: 'En brouillon', value: (r) => fmtCount(count(r, 'statut', 'Brouillon')), detail: () => 'Non proposées dans les formulaires' },
  ],
};
