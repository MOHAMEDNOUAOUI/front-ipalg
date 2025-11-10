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
        data:['DASHBOARD']
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
          },{
            path: 'categories',
            loadComponent: () => import('./features/environement/components/categories/categories').then(
              (Categories) => Categories.Categories
            )

          },{
            path: 'documents',
            loadComponent: () => import('./features/environement/components/documents/documents').then(
              (Documents) => Documents.Documents
            )
          },{
            path: 'champs-personalises',
            loadComponent: () => import('./features/environement/components/champs-personalises/champs-personalises').then(
              (champspersonalises) => champspersonalises.ChampsPersonalises
            )
          },{
            path: 'variables-globales',
            loadComponent: () => import('./features/environement/components/variables-globales/variables-globales').then(
              (variablesGlobales) => variablesGlobales.VariablesGlobales
            )
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
