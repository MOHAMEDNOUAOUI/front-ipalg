import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { fmtInt, fmtPct } from '../../../utils/format';

export interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Circumference of the ring is normalised to 100 so values map straight to dash lengths. */
const GAP = 0.9;

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChart {
  readonly slices = input.required<Slice[]>();
  readonly caption = input('au total');

  protected readonly active = signal<number | null>(null);

  protected readonly total = computed(() => this.slices().reduce((s, x) => s + x.value, 0));

  protected readonly arcs = computed(() => {
    const total = this.total();
    let start = 0;
    return this.slices().map((s) => {
      const share = total > 0 ? (s.value / total) * 100 : 0;
      const arc = { ...s, dash: Math.max(share - GAP, 0), start };
      start += share;
      return arc;
    });
  });

  protected readonly shown = computed(() => {
    const i = this.active();
    const s = i === null ? null : this.slices()[i];
    return s
      ? { value: fmtInt(s.value), caption: s.label }
      : { value: fmtInt(this.total()), caption: this.caption() };
  });

  protected readonly summary = computed(() =>
    this.slices()
      .map((s) => `${s.label} : ${fmtInt(s.value)}`)
      .join(', ')
  );

  protected pct(value: number) {
    return fmtPct(value, this.total());
  }

  protected num(value: number) {
    return fmtInt(value);
  }
}
