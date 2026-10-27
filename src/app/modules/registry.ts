import { ModuleDef } from './module.types';
import { ACQUISITIONS, CESSIONS, INVENTAIRE, LITIGES, PROPOSITIONS, REQUISITIONS } from './data/patrimoine.data';
import {
  AMORTISSEMENTS,
  BAUX_DONNES,
  BAUX_PRIS,
  ECHEANCIER,
  MAINTENANCE,
  PROJETS,
} from './data/exploitation.data';
import {
  AUDIT,
  CHAMPS,
  ENTITES,
  FOURNISSEURS,
  GED,
  LISTES,
  VARIABLES,
} from './data/administration.data';

/** Every list module, keyed by its route path. `app.routes.ts` builds a route for each entry. */
export const MODULES: Record<string, ModuleDef> = Object.fromEntries(
  [
    INVENTAIRE,
    PROPOSITIONS,
    ACQUISITIONS,
    REQUISITIONS,
    LITIGES,
    CESSIONS,
    BAUX_DONNES,
    BAUX_PRIS,
    ECHEANCIER,
    AMORTISSEMENTS,
    PROJETS,
    MAINTENANCE,
    GED,
    FOURNISSEURS,
    ENTITES,
    AUDIT,
    CHAMPS,
    LISTES,
    VARIABLES,
  ].map((m) => [m.key, m])
);

/** Routes mounted at the shell level; the two `environement/*` entries are child routes instead. */
export const SHELL_MODULE_KEYS = Object.keys(MODULES).filter((k) => !k.startsWith('environement/'));
