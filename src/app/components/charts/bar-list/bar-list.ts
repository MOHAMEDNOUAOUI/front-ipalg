import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { fmtInt, fmtPct } from '../../../utils/format';

export interface BarRow {
  label: string;
  value: number;
}

/** Ranked horizontal bars: one measure, every bar labelled with its value and share. */
@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.html',
  styleUrl: './bar-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarList {
  readonly rows = input.required<BarRow[]>();
  readonly unit = input('');

  protected readonly total = computed(() => this.rows().reduce((s, r) => s + r.value, 0));

  protected readonly view = computed(() => {
    const max = Math.max(...this.rows().map((r) => r.value), 1);
    const total = this.total();
    return [...this.rows()]
      .sort((a, b) => b.value - a.value)
      .map((r) => ({
        label: r.label,
        width: (r.value / max) * 100,
        value: fmtInt(r.value),
        share: fmtPct(r.value, total),
      }));
  });
}
