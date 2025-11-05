import { tab } from './../../interfaces/sidepanel-tabs';
import { Component } from '@angular/core';
import { sidePanel_Tabs } from '../../interfaces/sidepanel-tabs';
import { Router, NavigationEnd, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cssArrowsExchangeAltV } from '@ng-icons/css.gg';
@Component({
  selector: 'app-sidepanel',
  standalone: true,
  imports: [RouterLinkActive, RouterModule, CommonModule, NgIcon],
  templateUrl: './sidepanel.component.html',
  styleUrl: './sidepanel.component.scss',
  viewProviders: [provideIcons({ cssArrowsExchangeAltV })],
})
export class SidepanelComponent {
  tabs: sidePanel_Tabs[] = [
    {
      header: 'general',
      active: true,
      icon: 'pi-home',
      links: [
        {
          label: 'dashboard',
          icon: 'pi-chart-bar',
          route: 'dashboard',
        },
        {
          label: 'inventaire',
          icon: 'pi-inbox',
          route: 'inventaire',
        },
        // {
        //   label: 'documents',
        //   icon: 'pi-folder-open',
        //   route: 'test',
        // },
      ],
    },
    {
      header: 'administration',
      active: true,
      icon: 'pi-globe',
      links: [
        {
          label: 'environnement',
          icon: 'pi-globe',
          route: 'environement',
        },
        {
          label: 'utilisateurs',
          icon: 'pi-users',
          route: 'utilisateurs',
        },
        // {
        //   label: 'utilisateurs',
        //   icon: 'pi-users',
        //   route: 'test',
        // },
        // {
        //   label: 'fournisseurs',
        //   icon: 'pi-truck',
        //   route: 'test',
        // },
        // {
        //   label: 'entities',
        //   icon: 'pi-case',
        //   route: 'test',
        // },
      ],
    },
    {
      header: 'maintenance & projets',
      icon: 'pi-cog',
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
      header: 'patrimoine',
      active: true,
      icon: 'pi-building',
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
      header: 'location',
      icon: 'pi-home',
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

  constructor(private router: Router) {}

  ngOnInit() {
    // this.tabs.forEach((tab: sidePanel_Tabs) => {
    //   tab.active = tab.links.some((link) => this.router.url.includes(link.route));
    // });
  }

  opentab(tab: sidePanel_Tabs) {
    const existingTab = this.tabs.find((tabb: sidePanel_Tabs) => tabb.header == tab.header);
    this.tabs.map((tabb: sidePanel_Tabs) =>
      tabb.header == tab.header ? (tabb.active = !tabb.active) : (tabb.active = false)
    );
    // console.log();
  }
}
