import { Component } from '@angular/core';
import {
  PButtonComponent,
  Severity,
} from '../../shared/p-button/p-button.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeftSideNavigationPanelComponent } from '../../shared/left-side-navigation-panel/left-side-navigation-panel.component';
import { navigation } from '../../interfaces/sidepanel-tabs';

@Component({
  selector: 'app-environement',
  standalone: true,
  imports: [
    PButtonComponent,
    CommonModule,
    RouterModule,
    LeftSideNavigationPanelComponent,
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
      route: 'environement/categorie',
      active: true,
    },
    {
      label: 'Documents',
      route: 'environement/documents',
      active: true,
    },
    {
      label: 'Champs Personalisés',
      route: 'environement/champs-personalises',
      active: true,
    },
    {
      label: 'Variables Globales',
      route: 'environement/variable-global',
      active: true,
    },
  ];
}
