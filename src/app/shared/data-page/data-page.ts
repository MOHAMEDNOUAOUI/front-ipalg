import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Col, ModuleDef, Row, Tone, fmtDate, fmtMoney } from '../../modules/module.types';
import { Documents } from '../documents/documents';
import { fmtInt } from '../../utils/format';
import { FALLING_IS_GOOD, deltaPct, demoTrend, sparkline } from '../../utils/spark';

type PanelMode = 'view' | 'edit' | 'create';
type Draft = Record<string, string | number>;

const PAGE_SIZE = 10;

/** Table, KPI strip, status filter and detail drawer for any ModuleDef. Data is local demo data. */
@Component({
  selector: 'app-data-page',
  imports: [NgIcon, Documents],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-page.html',
  styleUrl: './data-page.scss',
  host: { '(document:keydown.escape)': 'closePanel()' },
})
export class DataPage {
  readonly def = input.required<ModuleDef>();
  /** Hide the page header when a parent page already shows one. */
  readonly embedded = input(false);

  protected readonly rows = linkedSignal<Row[]>(() => this.def().rows);
  protected readonly query = signal('');
  protected readonly status = signal('');
  protected readonly sort = signal<{ key: string; dir: 1 | -1 } | null>(null);
  protected readonly page = signal(0);
  protected readonly panel = signal<{ mode: PanelMode; row: Row | null } | null>(null);
  protected readonly draft = signal<Draft>({});
  protected readonly submitted = signal(false);
  protected readonly notice = signal('');
  protected readonly selected = signal<ReadonlySet<string>>(new Set());

  private readonly panelEl = viewChild<ElementRef<HTMLElement>>('panelEl');
  private lastFocus: HTMLElement | null = null;

  protected readonly tableCols = computed(() => this.def().cols.filter((c) => !c.drawerOnly));
  protected readonly kpis = computed(() =>
    this.def().kpis.map((k) => {
      const series = k.trend ?? demoTrend(k.label);
      const delta = deltaPct(series);
      const better = k.better ?? (FALLING_IS_GOOD.test(k.label) ? 'down' : 'up');
      return {
        label: k.label,
        value: k.value(this.rows()),
        detail: k.detail?.(this.rows()) ?? '',
        line: sparkline(series),
        delta,
        up: delta >= 0,
        good: delta === 0 ? null : (delta > 0) === (better === 'up'),
      };
    })
  );
  protected readonly statusKeys = computed(() => Object.keys(this.def().statuses ?? {}));
  protected readonly statusChips = computed(() => {
    const key = this.def().statusKey;
    const all = this.rows();
    return this.statusKeys().map((s) => ({
      value: s,
      count: key ? all.filter((r) => r[key] === s).length : 0,
    }));
  });

  protected readonly filtered = computed(() => {
    const d = this.def();
    const q = this.query().trim().toLowerCase();
    const st = this.status();
    let list = this.rows().filter((r) => {
      if (st && d.statusKey && r[d.statusKey] !== st) return false;
      if (!q) return true;
      return d.cols.some((c) => c.type !== 'status' && String(r[c.key]).toLowerCase().includes(q));
    });
    const s = this.sort();
    if (s) {
      const col = d.cols.find((c) => c.key === s.key);
      const numeric = col?.type === 'money' || col?.type === 'number' || col?.type === 'percent';
      list = [...list].sort((a, b) =>
        numeric
          ? (Number(a[s.key]) - Number(b[s.key])) * s.dir
          : String(a[s.key]).localeCompare(String(b[s.key]), 'fr', { numeric: true }) * s.dir
      );
    }
    return list;
  });
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  protected readonly visible = computed(() => {
    const start = Math.min(this.page(), this.pageCount() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });
  protected readonly range = computed(() => {
    const total = this.filtered().length;
    if (!total) return '0 résultat';
    const start = Math.min(this.page(), this.pageCount() - 1) * PAGE_SIZE;
    return `${start + 1}–${Math.min(start + PAGE_SIZE, total)} sur ${fmtInt(total)}`;
  });
  /** Steps of the open row's status path, with the current one marked. */
  protected readonly timeline = computed(() => {
    const d = this.def();
    const row = this.panel()?.row;
    if (!d.stages || !d.statusKey || !row) return null;
    const at = d.stages.indexOf(String(row[d.statusKey]));
    return {
      steps: d.stages.map((label, i) => ({
        label,
        state: at < 0 ? 'todo' : i < at ? 'done' : i === at ? 'now' : 'todo',
      })),
      off: at < 0 ? String(row[d.statusKey]) : '',
    };
  });

  protected readonly selectedRows = computed(() => this.rows().filter((r) => this.selected().has(r.id)));
  protected readonly allVisible = computed(
    () => this.visible().length > 0 && this.visible().every((r) => this.selected().has(r.id))
  );

  protected readonly editing = computed(() => {
    const p = this.panel();
    return !!p && p.mode !== 'view';
  });

  constructor() {
    // Move focus into the drawer when it opens and give it back to the row on close.
    effect(() => {
      const el = this.panelEl()?.nativeElement;
      if (el) queueMicrotask(() => el.focus());
    });
  }

  protected setQuery(v: string) {
    this.query.set(v);
    this.page.set(0);
  }

  protected setStatus(v: string) {
    this.status.set(v);
    this.page.set(0);
  }

  protected toggleRow(id: string) {
    this.selected.update((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  protected toggleAll() {
    const ids = this.visible().map((r) => r.id);
    const all = this.allVisible();
    this.selected.update((s) => {
      const next = new Set(s);
      ids.forEach((id) => (all ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  protected clearSelection() {
    this.selected.set(new Set());
  }

  protected deleteSelected() {
    const n = this.selected().size;
    this.rows.update((r) => r.filter((x) => !this.selected().has(x.id)));
    this.clearSelection();
    this.flash(`${n} enregistrement${n > 1 ? 's' : ''} supprimé${n > 1 ? 's' : ''} (démonstration).`);
  }

  /** Ten bars, filled to the value; used for every percentage column. */
  protected meter(row: Row, c: Col): boolean[] {
    const n = Math.round(Math.max(0, Math.min(100, Number(row[c.key]))) / 10);
    return Array.from({ length: 10 }, (_, i) => i < n);
  }

  protected toggleSort(key: string) {
    const s = this.sort();
    if (!s || s.key !== key) this.sort.set({ key, dir: 1 });
    else if (s.dir === 1) this.sort.set({ key, dir: -1 });
    else this.sort.set(null);
  }

  protected ariaSort(key: string): 'ascending' | 'descending' | 'none' {
    const s = this.sort();
    return s?.key === key ? (s.dir === 1 ? 'ascending' : 'descending') : 'none';
  }

  protected tone(value: string | number): Tone {
    return this.def().statuses?.[String(value)] ?? 'neutral';
  }

  protected isNumeric(c: Col) {
    return c.type === 'money' || c.type === 'number' || c.type === 'percent';
  }

  protected display(row: Row, c: Col): string {
    const v = row[c.key];
    switch (c.type) {
      case 'money':
        return fmtMoney(Number(v));
      case 'date':
        return fmtDate(String(v));
      case 'percent':
        return `${fmtInt(Number(v))} %`;
      case 'number':
        return fmtInt(Number(v));
      default:
        return v === '' || v === undefined ? '—' : String(v);
    }
  }

  protected rowTitle(row: Row) {
    return String(row[this.def().titleKey]);
  }

  protected openRow(row: Row, ev?: Event) {
    this.lastFocus = (ev?.currentTarget as HTMLElement) ?? null;
    this.submitted.set(false);
    this.panel.set({ mode: 'view', row });
  }

  protected startCreate(ev: Event) {
    this.lastFocus = ev.currentTarget as HTMLElement;
    const d = this.def();
    const draft: Draft = {};
    d.cols.forEach((c) => {
      draft[c.key] = c.type === 'status' ? this.statusKeys()[0] ?? '' : c.options?.[0] ?? '';
    });
    this.draft.set(draft);
    this.submitted.set(false);
    this.panel.set({ mode: 'create', row: null });
  }

  protected startEdit() {
    const p = this.panel();
    if (!p?.row) return;
    this.draft.set({ ...p.row });
    this.submitted.set(false);
    this.panel.set({ mode: 'edit', row: p.row });
  }

  protected setField(c: Col, ev: Event) {
    const raw = (ev.target as HTMLInputElement).value;
    const numeric = this.isNumeric(c);
    this.draft.update((d) => ({ ...d, [c.key]: numeric && raw !== '' ? Number(raw) : raw }));
  }

  protected invalid(c: Col) {
    return this.submitted() && (c.required || c.key === this.def().titleKey) && !String(this.draft()[c.key] ?? '').trim();
  }

  protected save() {
    this.submitted.set(true);
    const d = this.draft();
    const missing = this.def().cols.some(
      (c) => (c.required || c.key === this.def().titleKey) && !String(d[c.key] ?? '').trim()
    );
    if (missing) return;
    const p = this.panel();
    if (p?.mode === 'create') {
      const row = { ...d, id: `n${Date.now()}` } as Row;
      this.rows.update((r) => [row, ...r]);
      this.panel.set({ mode: 'view', row });
      this.flash('Enregistrement ajouté (données de démonstration, non sauvegardées).');
    } else if (p?.row) {
      const row = { ...d, id: p.row.id } as Row;
      this.rows.update((r) => r.map((x) => (x.id === row.id ? row : x)));
      this.panel.set({ mode: 'view', row });
      this.flash('Modifications enregistrées (démonstration).');
    }
  }

  protected cancelEdit() {
    const p = this.panel();
    if (p?.mode === 'edit') this.panel.set({ mode: 'view', row: p.row });
    else this.closePanel();
  }

  protected closePanel() {
    if (!this.panel()) return;
    this.panel.set(null);
    this.lastFocus?.focus();
  }

  protected exportCsv(onlySelected = false) {
    const cols = this.def().cols;
    const source = onlySelected ? this.selectedRows() : this.filtered();
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      cols.map((c) => esc(c.label)).join(';'),
      ...source.map((r) => cols.map((c) => esc(r[c.key])).join(';')),
    ];
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.def().key.replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private flash(msg: string) {
    this.notice.set(msg);
    setTimeout(() => this.notice.set(''), 4000);
  }
}
