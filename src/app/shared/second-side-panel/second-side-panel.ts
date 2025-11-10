import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { sidePanel_Tabs } from '../../interfaces/sidepanel-tabs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-second-side-panel',
  imports: [NgIcon, CommonModule, RouterModule],
  templateUrl: './second-side-panel.html',
  styleUrl: './second-side-panel.scss',
  viewProviders: [],
})
export class SecondSidePanel {
  tabs: sidePanel_Tabs[] = [
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

  constructor(public router: Router) {}

  ngOnInit() {
    this.tabs.forEach((tab: sidePanel_Tabs) => {
      tab.active = tab.links.some((link) => this.router.url.includes(link.route));
    });
  }

  opentab(tab: sidePanel_Tabs) {
    const existingTab = this.tabs.find((tabb: sidePanel_Tabs) => tabb.header == tab.header);
    this.tabs.map((tabb: sidePanel_Tabs) =>
      tabb.header == tab.header ? (tabb.active = !tabb.active) : (tabb.active = false)
    );
    // console.log();
  }
}
