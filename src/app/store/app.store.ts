import { sidePanel_Tabs } from './../interfaces/sidepanel-tabs';
import { effect, Inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

enum Appearance {
  Light = 'Light',
  Dark = 'Dark',
}
enum Languages {
  Francais = 'Francais',
  Anglais = 'Anglais',
}

type AppState = {
  navigationPanelState: boolean;
  appearance: Appearance;
  langue: Languages;
  sidePanel_Tabs: any[];
};

const initialeState: AppState = {
  navigationPanelState: localStorage.getItem('navigationItem')
    ? JSON.parse(localStorage.getItem('navigationItem')!)
    : false,
  appearance: localStorage.getItem('appearance')
    ? JSON.parse(localStorage.getItem('appearance')!)
    : Appearance.Light,
  langue: localStorage.getItem('langue')
    ? JSON.parse(localStorage.getItem('langue')!)
    : Languages.Francais,
  sidePanel_Tabs: [
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
              route: 'environement/documents',
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
          icon: 'tablerTruckDelivery',
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
  ],
};

@Injectable({
  providedIn: 'root',
})
export class AppStore extends signalStore(
  withState(initialeState),
  withComputed((store) => ({
    sidePanelState: store.navigationPanelState,
    appearanceState: store.appearance,
    langue: store.langue,
    sidePanelTabs: store.sidePanel_Tabs,
  })),
  withMethods((store) => ({
    getRouteTabs(routes: string) {
      let foundTab = store
        .sidePanelTabs()
        .find((route: any) => route.links.find((link: any) => link.route === routes));

      let foundLink = foundTab ? foundTab.links.find((link: any) => link.route === routes) : null;
      return foundLink || null;
    },
    setLangue(langue: Languages) {
      patchState(store, { langue: langue });
      localStorage.setItem('langue', JSON.stringify(langue));
    },
    setNavigationState() {
      const newState = !store.navigationPanelState();
      patchState(store, { navigationPanelState: newState });
      localStorage.setItem('navigationItem', JSON.stringify(newState));
    },
    setAppearance(apperance: Appearance) {
      const newAppearance = apperance;
      patchState(store, { appearance: newAppearance });
      localStorage.setItem('appearance', JSON.stringify(newAppearance));
    },
    toggleAppearance() {
      const newAppearance =
        store.appearance() === Appearance.Light ? Appearance.Dark : Appearance.Light;
      this.setAppearance(newAppearance);
    },
    applyTheme(appearance: Appearance) {
      const html = document.documentElement;

      if (appearance === Appearance.Dark) {
        html.setAttribute('data-theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
      }
    },
    initializeTheme() {
      // Apply theme on store initialization
      this.applyTheme(store.appearance());

      // Listen for system preference changes (only if no manual choice)
      if (!localStorage.getItem('appearance')) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const systemTheme = e.matches ? Appearance.Dark : Appearance.Light;
          patchState(store, { appearance: systemTheme });
          this.applyTheme(systemTheme);
        });
      }
    },

    applyAppearances() {
      if (!localStorage.getItem('appearance')) {
        localStorage.setItem('appearance', JSON.stringify(Appearance.Light));
      }
      if (!localStorage.getItem('langue')) {
        localStorage.setItem('langue', JSON.stringify(Languages.Francais));
      }
    },
  }))
) {
  constructor() {
    super();

    effect(() => {
      this.applyTheme(this.appearance());
    });
    this.applyAppearances();
    this.initializeTheme();
  }
}
