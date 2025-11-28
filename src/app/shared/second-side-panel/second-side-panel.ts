import { AppStore } from './../../store/app.store';
import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { sidePanel_Tabs } from '../../interfaces/sidepanel-tabs';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-second-side-panel',
  imports: [NgIcon, CommonModule, RouterModule],
  templateUrl: './second-side-panel.html',
  styleUrl: './second-side-panel.scss',
  viewProviders: [],
})
export class SecondSidePanel {
  tabs: any[] = [
    {
      header: 'Menu',
      active: true,
      // icon: 'pi-home',
      icon: 'tablerHomeFill',
      links: [
        {
          label: 'Dashboard',
          icon: 'tablerLayoutDashboardFill',
          route: 'dashboard',
        },
        {
          label: 'Inventaire',
          icon: 'tablerArchiveFill',
          route: 'inventaire',
        },

        // {
        //   label: 'Utilisateurs',
        //   icon: 'pi-users',
        //   route: 'utilisateurs',
        // },
        // {
        //   label: 'documents',
        //   icon: 'pi-folder-open',
        //   route: 'test',
        // },
      ],
    },
    {
      header: 'Administration',
      active: true,
      icon: 'tablerShieldHalfFill',
      links: [
        {
          label: 'Environnement',
          icon: 'tablerCloverFill',
          route: 'environement',
          active: false,
          links: [
            {
              label: 'Accès Management',
              icon: 'tablerCloverFill',
              route: 'environement/profils',
            },
            {
              label: 'Categories Management',
              icon: 'tablerCloverFill',
              route: 'environement/categories',
            },
            {
              label: 'Documents Management',
              icon: 'tablerCloverFill',
              route: 'test',
            },
            {
              label: 'Champs Personalisés',
              icon: 'tablerCloverFill',
              route: 'test',
            },
            {
              label: 'Variables Globales',
              icon: 'tablerCloverFill',
              route: 'test',
            },
          ],
        },
        {
          label: 'Utilisateurs',
          icon: 'tablerUsers',
          route: 'utilisateurs',
        },
        {
          label: 'Fournisseurs',
          icon: 'tablerTruckDelivery',
          route: 'test',
        },
        {
          label: 'Entities',
          icon: 'pi-case',
          route: 'test',
        },
      ],
    },
    {
      header: 'Maintenance & projets',
      icon: 'ionHome',
      active: true,
      links: [
        {
          label: 'orders de maintenance',
          icon: 'pi-cog',
          route: 'test',
        },
        {
          label: 'projets immobiliers',
          icon: 'pi-sitemap',
          route: 'test',
        },
        // {
        //   label: 'inventaire',
        //   icon: 'pi-warehouse',
        //   route: 'test',
        // },
      ],
    },
    {
      header: 'Patrimoine Management',
      active: true,
      icon: 'ionHome',
      links: [
        {
          label: 'immobilisatoins',
          icon: 'pi-home',
          route: 'test',
        },
        {
          label: 'propositions',
          icon: 'pi-flag',
          route: 'test',
        },
        {
          label: 'récquisitions',
          icon: 'pi-home',
          route: 'test',
        },
        {
          label: 'acquisition & cessions',
          icon: 'pi-undo',
          route: 'test',
        },
        {
          label: 'litigues',
          icon: 'pi-exclamation-triangle',
          route: 'test',
        },
      ],
    },
    {
      header: 'Baux Management',
      icon: 'ionHome',
      active: true,
      links: [
        {
          label: 'baux données',
          icon: 'pi-home',
          route: 'test',
        },
        {
          label: 'baux pris',
          icon: 'pi-flag',
          route: 'test',
        },
        {
          label: 'paiement',
          icon: 'pi-wallet',
          route: 'test',
        },
        {
          label: 'contrat locative',
          icon: 'pi-undo',
          route: 'test',
        },
      ],
    },
  ];

  constructor(public router: Router, public AppStore: AppStore) {}

  ngOnInit() {
    this.starterPanel();
    console.log(this.AppStore.sidePanelState());
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.starterPanel();
      });
  }

  starterPanel() {
    const currentUrl = this.router.url;

    this.tabs.forEach((tab: any) => {
      let tabMatch = false;

      tab.links.forEach((link: any) => {
        if (!link.links) {
          link.active = currentUrl.includes(link.route);
          if (link.active) tabMatch = true;
        } else {
          let linkMatch = false;
          link.links.forEach((subLink: any) => {
            subLink.active = currentUrl.includes(subLink.route);
            if (subLink.active) linkMatch = true;
          });

          link.active = linkMatch || currentUrl.includes(link.route);
          if (link.active) tabMatch = true;
        }
      });

      tab.active = tabMatch;
    });
  }
  openTab(tab: any) {
    this.tabs.forEach((t: any) => {
      if (t.header === tab.header) {
        t.active = true;
      } else {
        t.active = false;
      }
    });
  }

  closeTabs() {
    this.tabs.forEach((t: any) => {
      t.active = false;
    });
  }

  openSubTab(parentTab: any, childTab: any) {
    parentTab.active = true;

    parentTab.links.forEach((sub: any) => {
      sub.active = sub.label === childTab.label ? !sub.active : false;
    });
  }

  openNestedSubTab(parentTab: any, childTab: any, subChild: any) {
    parentTab.active = true;
    childTab.active = true;

    childTab.links.forEach((sub: any) => {
      sub.active = sub.label === subChild.label;
    });
  }
}
