import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Cell {
  label: string;
  value: number;
}

interface Box {
  label: string;
  value: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Split a sorted list into two halves of similar weight and recurse, alternating direction. */
function layout(items: Cell[], x: number, y: number, w: number, h: number, out: Box[]) {
  if (items.length === 1) {
    out.push({ ...items[0], x, y, w, h });
    return;
  }
  const total = items.reduce((s, i) => s + i.value, 0);
  let acc = 0;
  let k = 0;
  while (k < items.length - 1 && acc + items[k].value / 2 < total / 2) acc += items[k++].value;
  k = Math.max(1, k);
  const a = items.slice(0, k);
  const b = items.slice(k);
  const share = a.reduce((s, i) => s + i.value, 0) / total;
  if (w >= h) {
    layout(a, x, y, w * share, h, out);
    layout(b, x + w * share, y, w * (1 - share), h, out);
  } else {
    layout(a, x, y, w, h * share, out);
    layout(b, x, y + h * share, w, h * (1 - share), out);
  }
}

const TONES = ['var(--brand-dark)', 'var(--chart-3)', 'var(--chart-2)', 'var(--brand-mid)', 'var(--chart-4)', 'var(--chart-5)'];

/** Area-proportional blocks; the biggest value gets the darkest tone. */
@Component({
  selector: 'app-treemap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map" role="img" [attr.aria-label]="label()" [style.height.px]="height()">
      @for (b of boxes(); track b.label; let i = $index) {
        <div
          class="cell"
          [class.light]="i > 3"
          [style.left.%]="b.x"
          [style.top.%]="b.y"
          [style.width.%]="b.w"
          [style.height.%]="b.h"
        >
          <div class="in" [style.background]="tone(i)">
            <span class="n">{{ b.label }}</span>
            <span class="v num">{{ b.value }} <small>{{ unit() }}</small></span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .map {
      position: relative;
      width: 100%;
    }
    .cell {
      position: absolute;
      padding: 2px;
    }
    .in {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      overflow: hidden;
      color: #fff;
      transition: filter var(--dur-fast) linear;
    }
    .in:hover {
      filter: brightness(1.12);
    }
    .light .in {
      color: var(--ink);
    }
    .n {
      font-size: 12.5px;
      font-weight: 600;
      opacity: 0.9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .v {
      white-space: nowrap;
      font-size: 19px;
      font-weight: 650;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }
    .v small {
      font-size: 11px;
      font-weight: 500;
      opacity: 0.75;
    }
  `,
})
export class Treemap {
  readonly cells = input.required<Cell[]>();
  readonly unit = input('');
  readonly height = input(280);
  readonly label = input('Répartition');

  protected readonly boxes = computed(() => {
    const out: Box[] = [];
    const sorted = [...this.cells()].sort((a, b) => b.value - a.value);
    if (sorted.length) layout(sorted, 0, 0, 100, 100, out);
    return out;
  });

  protected tone(i: number): string {
    return TONES[Math.min(i, TONES.length - 1)];
  }
}
