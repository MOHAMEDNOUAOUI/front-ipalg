import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SHELL_MODULE_KEYS } from './modules/registry';

const modulePage = () => import('./modules/module-page').then((m) => m.ModulePage);

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (dashboard) => dashboard.DashboardComponent
          ),
        data: ['DASHBOARD'],
      },
      {
        path: 'environement',
        loadComponent: () =>
          import('./features/environement/environement.component').then(
            (environement) => environement.EnvironementComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'profils',
            pathMatch: 'full',
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./features/environement/components/categories/categories').then(
                (Categories) => Categories.Categories
              ),
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./features/environement/components/documents/documents').then(
                (Documents) => Documents.Documents
              ),
          },
          {
            path: 'listes-valeurs',
            loadComponent: modulePage,
            data: { module: 'environement/listes-valeurs', embedded: true },
          },
          {
            path: 'champs-personalises',
            loadComponent: modulePage,
            data: { module: 'environement/champs-personalises', embedded: true },
          },
          {
            path: 'variables-globales',
            loadComponent: modulePage,
            data: { module: 'environement/variables-globales', embedded: true },
          },
          {
            path: 'profils',
            loadComponent: () =>
              import('./features/environement/components/profils/profils.component').then(
                (profils) => profils.ProfilsComponent
              ),
          },
        ],
      },
      //utilisateurs
      {
        path: 'utilisateurs',
        loadComponent: () =>
          import('./features/utilisateurs/utilisateurs.component').then(
            (u) => u.UtilisateursComponent
          ),
      },
      // Settings page layout
      {
        path: 'parametres',
        loadComponent: () => import('./features/parametres/parametres').then((p) => p.Parametres),
        children: [
          {
            path: '',
            redirectTo: 'parametre-general',
            pathMatch: 'full',
          },
          {
            path: 'parametre-modules',
            loadComponent: () =>
              import('./features/parametres/components/modules/modules').then((m) => m.Modules),
          },
          {
            path: 'parametre-permissions',
            loadComponent: () =>
              import('./features/parametres/components/permissions/permissions').then(
                (p) => p.Permissions
              ),
          },
          {
            path: 'parametre-general',
            loadComponent: () =>
              import('./features/parametres/components/general/general').then((g) => g.General),
          },
        ],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then((n) => n.Notifications),
      },
      {
        path: 'centre-aide',
        loadComponent: () => import('./features/centre-aide/centre-aide').then((n) => n.CentreAide),
      },
      // List modules (links in config/navigation.ts, definitions in modules/data).
      ...SHELL_MODULE_KEYS.map((key) => ({
        path: key,
        loadComponent: modulePage,
        data: { module: key },
      })),
    ],
  },
];
