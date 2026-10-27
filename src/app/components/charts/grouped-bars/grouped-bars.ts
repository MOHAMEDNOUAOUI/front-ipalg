import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { fmtDec } from '../../../utils/format';

export interface Series {
  name: string;
  color: string;
}

export interface Group {
  label: string;
  /** One value per series, same order as `series`. */
  values: number[];
}

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];

/** Vertical grouped columns on a single shared axis, with a per-group hover/focus tooltip. */
@Component({
  selector: 'app-grouped-bars',
  templateUrl: './grouped-bars.html',
  styleUrl: './grouped-bars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedBars {
  readonly series = input.required<Series[]>();
  readonly groups = input.required<Group[]>();
  readonly unit = input('');

  protected readonly active = signal<number | null>(null);

  protected readonly axis = computed(() => {
    const peak = Math.max(...this.groups().flatMap((g) => g.values), 1);
    const step = STEPS.find((s) => Math.ceil(peak / s) <= 4) ?? STEPS[STEPS.length - 1];
    const max = Math.ceil(peak / step) * step;
    const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
    return { max, ticks };
  });

  protected readonly totals = computed(() =>
    this.series().map((s, i) => ({
      ...s,
      total: fmtDec(this.groups().reduce((sum, g) => sum + g.values[i], 0)),
    }))
  );

  protected readonly bars = computed(() => {
    const max = this.axis().max;
    return this.groups().map((g) => ({
      label: g.label,
      cols: g.values.map((v, i) => ({
        height: (v / max) * 100,
        color: this.series()[i].color,
      })),
    }));
  });

  protected readonly tip = computed(() => {
    const i = this.active();
    if (i === null) return null;
    const g = this.groups()[i];
    return {
      label: g.label,
      rows: this.series().map((s, k) => ({ ...s, value: fmtDec(g.values[k]) })),
      pos: i === 0 ? 'start' : i === this.groups().length - 1 ? 'end' : 'mid',
      at: ((i + 0.5) / this.groups().length) * 100,
    };
  });

  protected fmt(n: number) {
    return fmtDec(n);
  }
}
