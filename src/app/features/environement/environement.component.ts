import { Component } from '@angular/core';
import { PButtonComponent, Severity } from '../../shared/p-button/p-button.component';

import { Router, RouterModule } from '@angular/router';
import { LeftSideNavigationPanelComponent } from '../../shared/left-side-navigation-panel/left-side-navigation-panel.component';
import { navigation } from '../../interfaces/sidepanel-tabs';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-environement',
  standalone: true,
  imports: [
    PButtonComponent,
    RouterModule,
    LeftSideNavigationPanelComponent,
    PaginationComponent
],
  templateUrl: './environement.component.html',
  styleUrl: './environement.component.scss',
})
export class EnvironementComponent {
  Severity = Severity;

  navigationList: navigation[] = [
    {
      label: 'Accès Management',
      route: 'profils',
      active: true,
      text: {
        h2: 'Accés Management Settings',
        p: 'Manager profils, permissions',
      },
    },
    {
      label: 'Modules',
      route: 'modules',
      active: false,
    },
    {
      label: 'Categories',
      route: 'categories',
      active: true,
      text: {
        h2: 'Categories Management',
        p: 'Manager Categories',
      },
    },
    {
      label: 'Documents',
      route: 'documents',
      active: true,
      text: {
        h2: 'Documents Management',
        p: 'Manager Documents',
      },
    },
    {
      label: 'Champs Personalisés',
      route: 'champs-personalises',
      active: true,
      text: {
        h2: 'Champs Personalisés Management',
        p: 'Manager Champs Personalisés',
      },
    },
    {
      label: 'Variables Globales',
      route: 'variables-globales',
      active: true,
      text: {
        h2: 'Variables Globales Management',
        p: 'Manager Variables Globales',
      },
    },
  ];

  constructor(public router: Router) {}
}
