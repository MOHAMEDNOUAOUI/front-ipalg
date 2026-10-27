/**
 * Single source of truth for the side navigation. List modules must also exist in
 * modules/registry.ts, which builds their routes.
 * Routes are absolute-from-root paths without a leading slash.
 */
export interface NavLink {
  label: string;
  route: string;
  icon: string;
  description?: string;
  /** Sub-pages, read by the environement page for its own tabs. */
  links?: NavLink[];
}

export interface NavGroup {
  id: string;
  header: string;
  icon: string;
  links: NavLink[];
}

export const APP_NAME = 'BOA Patrimo';
export const APP_TAGLINE = 'Immobilisations';

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'pilotage',
    header: 'Pilotage',
    icon: 'tablerLayoutDashboard',
    links: [
      { label: 'Tableau de bord', route: 'dashboard', icon: 'tablerLayoutDashboard' },
      { label: 'Alertes', route: 'notifications', icon: 'tablerBell' },
    ],
  },
  {
    id: 'patrimoine',
    header: 'Patrimoine',
    icon: 'tablerBuildingSkyscraper',
    links: [
      { label: 'Base patrimoniale', route: 'inventaire', icon: 'tablerBuildingSkyscraper' },
      {
        label: 'Propositions',
        route: 'patrimoine/propositions',
        icon: 'tablerClipboardList',
        description:
          'Propositions de biens à acquérir ou à louer, évaluées et validées par la commission.',
      },
      {
        label: 'Acquisitions',
        route: 'patrimoine/acquisitions',
        icon: 'tablerFileCertificate',
        description: 'Contrats, propriétaires, enregistrement et paiement de chaque acquisition.',
      },
      {
        label: 'Réquisitions',
        route: 'patrimoine/requisitions',
        icon: 'tablerMapPin',
        description: 'Demande, publication, affichage et création du titre foncier.',
      },
      {
        label: 'Litiges',
        route: 'patrimoine/litiges',
        icon: 'tablerGavel',
        description: 'Litiges liés à un bien ou à une procédure, avec avocat et tribunal.',
      },
      {
        label: 'Cessions',
        route: 'patrimoine/cessions',
        icon: 'tablerArrowsExchange',
        description: 'Sorties de biens : valeur de sortie, notaire, taxes et PV de cession.',
      },
    ],
  },
  {
    id: 'location',
    header: 'Gestion locative',
    icon: 'tablerHome2',
    links: [
      {
        label: 'Baux donnés',
        route: 'location/baux-donnes',
        icon: 'tablerHome2',
        description: 'Biens loués à des tiers : contrats de bail, révisions, renouvellements, résiliations.',
      },
      {
        label: 'Baux pris',
        route: 'location/baux-pris',
        icon: 'tablerKey',
        description: 'Biens loués par la banque : contrats de bail, charges, révisions et suspensions.',
      },
      {
        label: 'Échéancier',
        route: 'location/echeancier',
        icon: 'tablerCalendarDue',
        description: 'Échéances de loyer générées par contrat, paiements et réconciliation.',
      },
    ],
  },
  {
    id: 'finance',
    header: 'Finance',
    icon: 'tablerCoin',
    links: [
      {
        label: 'Amortissements',
        route: 'finance/amortissements',
        icon: 'tablerCalculator',
        description: 'Calcul linéaire ou dégressif, VNC, évaluation et réévaluation des actifs.',
      },
    ],
  },
  {
    id: 'projets',
    header: 'Projets & maintenance',
    icon: 'tablerTools',
    links: [
      {
        label: 'Projets immobiliers',
        route: 'projets',
        icon: 'tablerSitemap',
        description: 'Aménagements, réaménagements, jalons, réserves et réceptions.',
      },
      {
        label: 'Ordres de maintenance',
        route: 'maintenance',
        icon: 'tablerTools',
        description: 'Maintenance préventive et corrective, pannes, interventions et carnet d’entretien.',
      },
    ],
  },
  {
    id: 'documents',
    header: 'Documents',
    icon: 'tablerFolder',
    links: [
      {
        label: 'Base documentaire',
        route: 'ged',
        icon: 'tablerFileStack',
        description: 'Actes, plans, contrats et autorisations rattachés aux biens, avec versions.',
      },
    ],
  },
  {
    id: 'administration',
    header: 'Administration',
    icon: 'tablerShieldLock',
    links: [
      {
        label: 'Environnement',
        route: 'environement',
        icon: 'tablerListDetails',
        links: [
          { label: 'Accès Management', route: 'environement/profils', icon: 'tablerShieldLock' },
          { label: 'Listes de valeurs', route: 'environement/listes-valeurs', icon: 'tablerListDetails' },
          { label: 'Categories Management', route: 'environement/categories', icon: 'tablerListDetails' },
          { label: 'Documents Management', route: 'environement/documents', icon: 'tablerFileStack' },
          { label: 'Champs Personalisés', route: 'environement/champs-personalises', icon: 'tablerListDetails' },
          { label: 'Variables Globales', route: 'environement/variables-globales', icon: 'tablerListDetails' },
        ],
      },
      { label: 'Utilisateurs', route: 'utilisateurs', icon: 'tablerUsers' },
      {
        label: 'Fournisseurs',
        route: 'administration/fournisseurs',
        icon: 'tablerTruckDelivery',
        description: 'Référentiel des fournisseurs, synchronisé avec le système fournisseurs.',
      },
      {
        label: 'Entités',
        route: 'administration/entites',
        icon: 'tablerBuildingEstate',
        description: 'Entités de la banque et rattachement des utilisateurs.',
      },
      {
        label: 'Journal d’audit',
        route: 'administration/audit',
        icon: 'tablerHistory',
        description: 'Toutes les actions : utilisateur, poste, ancienne et nouvelle valeur, date.',
      },
    ],
  },
];

export const NAV_FOOTER: NavLink[] = [
  { label: 'Paramètres', route: 'parametres', icon: 'tablerSettings' },
  { label: 'Centre d’aide', route: 'centre-aide', icon: 'tablerHelpCircle' },
];

