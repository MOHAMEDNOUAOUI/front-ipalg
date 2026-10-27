import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { NAV_FOOTER, NAV_GROUPS } from '../../config/navigation';

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();

interface Hit {
  label: string;
  route: string;
  icon: string;
  where: string;
  text: string;
}

const HITS: Hit[] = [
  ...NAV_GROUPS.flatMap((g) =>
    g.links.map((l) => ({
      label: l.label,
      route: l.route,
      icon: l.icon,
      where: g.header,
      text: fold(`${l.label} ${g.header} ${l.description ?? ""}`),
    }))
  ),
  ...NAV_FOOTER.map((l) => ({
    label: l.label,
    route: l.route,
    icon: l.icon,
    where: 'Application',
    text: fold(l.label),
  })),
];

@Component({
  selector: 'app-topbar',
  imports: [NgIcon],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onGlobalKey($event)' },
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly query = signal('');
  protected readonly focused = signal(false);
  protected readonly cursor = signal(0);

  protected readonly hits = computed(() => {
    const q = fold(this.query().trim());
    if (!q) return [];
    return HITS.filter((h) => h.text.includes(q)).slice(0, 7);
  });

  protected readonly showList = computed(() => this.focused() && this.query().trim().length > 0);

  protected onInput(value: string) {
    this.query.set(value);
    this.cursor.set(0);
  }

  protected onFieldKey(e: KeyboardEvent) {
    const n = this.hits().length;
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      this.cursor.update((i) => (i + 1) % n);
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      this.cursor.update((i) => (i - 1 + n) % n);
    } else if (e.key === 'Enter' && n) {
      e.preventDefault();
      this.go(this.hits()[this.cursor()]);
    } else if (e.key === 'Escape') {
      this.query.set('');
      this.field()?.nativeElement.blur();
    }
  }

  protected go(hit: Hit) {
    this.router.navigateByUrl('/' + hit.route);
    this.query.set('');
    this.field()?.nativeElement.blur();
  }

  protected onGlobalKey(e: KeyboardEvent) {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? '');
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault();
      this.field()?.nativeElement.focus();
    }
  }
}
