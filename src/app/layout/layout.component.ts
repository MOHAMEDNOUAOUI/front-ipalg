import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStore } from '../store/app.store';
import { Sidebar } from '../shell/sidebar/sidebar';
import { NgIcon } from '@ng-icons/core';

const MOBILE_QUERY = '(max-width: 900px)';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, NgIcon, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  protected readonly store = inject(AppStore);
  protected readonly mobileOpen = signal(false);

  private readonly media = window.matchMedia(MOBILE_QUERY);
  protected readonly mobile = signal(this.media.matches);

  /** The icon rail only exists on desktop; on mobile the menu is a drawer. */
  protected readonly rail = computed(() => this.store.sidePanelState() && !this.mobile());

  constructor() {
    const onChange = (e: MediaQueryListEvent) => {
      this.mobile.set(e.matches);
      if (!e.matches) this.mobileOpen.set(false);
    };
    this.media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media.removeEventListener('change', onChange));
  }

  protected toggleNav() {
    if (this.mobile()) this.mobileOpen.update((o) => !o);
    else this.store.setNavigationState();
  }
}
