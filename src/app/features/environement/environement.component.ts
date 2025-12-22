import { Component, effect } from '@angular/core';
import { PButtonComponent, Severity } from '../../shared/p-button/p-button.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeftSideNavigationPanelComponent } from '../../shared/left-side-navigation-panel/left-side-navigation-panel.component';
import { navigation } from '../../interfaces/sidepanel-tabs';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AppStore } from '../../store/app.store';
import { RouteAfterCollapse } from '../../components/route-after-collapse/route-after-collapse';

@Component({
  selector: 'app-environement',
  standalone: true,
  imports: [
    PButtonComponent,
    CommonModule,
    RouterModule,
    LeftSideNavigationPanelComponent,
    PaginationComponent,
    RouteAfterCollapse,
  ],
  templateUrl: './environement.component.html',
  styleUrl: './environement.component.scss',
})
export class EnvironementComponent {
  Severity = Severity;
  isCollapsed: boolean = false;
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

  links: any[] = [];
  constructor(public router: Router, public appStore: AppStore) {
    effect(() => {
      this.isCollapsed = this.appStore.sidePanelState();
    });
  }

  ngOnInit() {
    this.links = this.appStore.getRouteTabs('environement').links;
  }
}
