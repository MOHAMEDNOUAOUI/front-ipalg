import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

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
      },
      {
        path: 'inventaire',
        loadComponent: () =>
          import('./features/inventaire/inventaire.component').then(
            (inventaire) => inventaire.InventaireComponent
          ),
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
            path: 'profils',
            loadComponent: () =>
              import('./features/environement/components/profils/profils.component').then(
                (profils) => profils.ProfilsComponent
              ),
            children: [
              {
                path: '',
                redirectTo: 'prf',
                pathMatch: 'full',
              },
              {
                path: 'prf',
                loadComponent: () =>
                  import(
                    './features/environement/components/sub-profils/sub-profils.component'
                  ).then((subPost) => subPost.SubProfilsComponent),
              },
            ],
          },
          {
            path: 'modules',
            loadComponent: () =>
              import('./features/environement/components/modules/modules.component').then(
                (modules) => modules.ModulesComponent
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
    ],
  },
];
