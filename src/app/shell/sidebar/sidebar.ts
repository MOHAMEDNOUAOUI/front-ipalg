import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { filter, map } from 'rxjs';
import {
  APP_NAME,
  APP_TAGLINE,
  NAV_FOOTER,
  NAV_GROUPS,
  NavGroup,
} from '../../config/navigation';
import { Topbar } from '../topbar/topbar';
import { DEMO_ALERT_COUNT } from '../../features/dashboard/dashboard.data';

const pathOf = (url: string) => url.split(/[?#]/)[0];
const isOn = (path: string, route: string) =>
  path === '/' + route || path.startsWith('/' + route + '/');

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, Topbar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.mobile-open]': 'mobileOpen()' },
})
export class Sidebar {
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly navigated = output<void>();
  readonly toggleNav = output<void>();

  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly tagline = APP_TAGLINE;
  protected readonly groups = NAV_GROUPS;
  protected readonly footer = NAV_FOOTER;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly activeGroupId = computed(() => {
    const path = pathOf(this.url());
    return NAV_GROUPS.find((g) => g.links.some((l) => isOn(path, l.route)))?.id ?? null;
  });

  private readonly opened = signal<ReadonlySet<string>>(new Set());

  constructor() {
    // The group that holds the current page is always open.
    effect(() => {
      const id = this.activeGroupId();
      if (id) this.opened.update((s) => (s.has(id) ? s : new Set(s).add(id)));
    });
  }

  protected isOpen(id: string) {
    return this.opened().has(id);
  }

  protected toggle(id: string) {
    this.opened.update((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  /** Count shown on a nav item that holds a queue needing action. */
  protected badge(route: string): number {
    return route === 'notifications' ? DEMO_ALERT_COUNT : 0;
  }

  protected firstRoute(group: NavGroup) {
    return '/' + group.links[0].route;
  }
}
