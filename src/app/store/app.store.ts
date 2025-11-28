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
  })),
  withMethods((store) => ({
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
  }))
) {
  constructor() {
    super();

    effect(() => {
      this.applyTheme(this.appearance());
    });

    this.initializeTheme();
  }
}
