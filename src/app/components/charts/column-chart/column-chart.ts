import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Stack {
  name: string;
  color: string;
  values: number[];
}

const W = 640;
const PAD = { l: 30, r: 6, t: 10, b: 26 };

/** Stacked columns with rounded ends and a hover read-out. */
@Component({
  selector: 'app-column-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" (pointerleave)="on.set(null)">
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + height()" role="img" [attr.aria-label]="label()">
        @for (t of ticks(); track t.label) {
          <line [attr.x1]="pad.l" [attr.x2]="W - pad.r" [attr.y1]="t.y" [attr.y2]="t.y" class="grid" />
          <text [attr.x]="pad.l - 8" [attr.y]="t.y + 4" text-anchor="end" class="axis">{{ t.label }}</text>
        }
        @for (c of cols(); track c.label; let i = $index) {
          <g (pointerenter)="on.set(i)" [class.dim]="on() !== null && on() !== i">
            <rect [attr.x]="c.x - c.w / 2 - 4" [attr.y]="pad.t" [attr.width]="c.w + 8" [attr.height]="height() - pad.t - pad.b" class="hit" />
            @for (s of c.segs; track s.name) {
              <rect [attr.x]="c.x - c.w / 2" [attr.y]="s.y" [attr.width]="c.w" [attr.height]="s.h" [attr.fill]="s.color" rx="4" />
            }
            <text [attr.x]="c.x" [attr.y]="height() - 8" text-anchor="middle" class="axis" [class.on]="on() === i">{{ c.label }}</text>
          </g>
        }
      </svg>
      @if (on() !== null) {
        <div class="tip" [style.left.%]="(cols()[on()!].x / W) * 100" [class.flip]="on()! > cols().length / 2">
          <strong>{{ cols()[on()!].label }}</strong>
          @for (s of stacks(); track s.name) {
            <span><i [style.background]="s.color"></i>{{ s.name }}<b class="num">{{ s.values[on()!] }}</b></span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .wrap {
      position: relative;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    .grid {
      stroke: var(--line);
      stroke-dasharray: 2 4;
    }
    .axis {
      font-size: 11px;
      fill: var(--ink-3);
    }
    .axis.on {
      fill: var(--ink);
      font-weight: 600;
    }
    .hit {
      fill: transparent;
    }
    g {
      transition: opacity var(--dur-fast) linear;
    }
    g.dim {
      opacity: 0.4;
    }
    .tip {
      position: absolute;
      top: 4px;
      transform: translateX(12px);
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 150px;
      padding: 8px 10px;
      border-radius: 9px;
      background: #14202b;
      color: #fff;
      font-size: 12px;
      pointer-events: none;
      z-index: 2;
    }
    .tip.flip {
      transform: translateX(calc(-100% - 12px));
    }
    .tip strong {
      color: #9db0c2;
      font-weight: 600;
    }
    .tip span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tip i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .tip b {
      margin-left: auto;
      padding-left: 12px;
    }
  `,
})
export class ColumnChart {
  readonly labels = input.required<string[]>();
  readonly stacks = input.required<Stack[]>();
  readonly height = input(240);
  readonly label = input('Graphique en colonnes');

  protected readonly W = W;
  protected readonly pad = PAD;
  protected readonly on = signal<number | null>(null);

  private readonly top = computed(() => {
    const max = Math.max(...this.labels().map((_, i) => this.stacks().reduce((s, k) => s + k.values[i], 0)));
    return Math.max(4, Math.ceil(max / 2) * 2);
  });

  private readonly y = computed(() => {
    const h = this.height();
    const top = this.top();
    return (v: number) => PAD.t + (1 - v / top) * (h - PAD.t - PAD.b);
  });

  protected readonly ticks = computed(() => {
    const top = this.top();
    return [0, top / 2, top].map((v) => ({ label: String(v), y: this.y()(v) }));
  });

  protected readonly cols = computed(() => {
    const n = this.labels().length;
    const slot = (W - PAD.l - PAD.r) / n;
    const w = Math.min(26, slot * 0.58);
    const y = this.y();
    return this.labels().map((label, i) => {
      let acc = 0;
      const segs = this.stacks()
        .map((s) => {
          const v = s.values[i];
          const y1 = y(acc + v);
          const y0 = y(acc);
          acc += v;
          return { name: s.name, color: s.color, y: y1, h: Math.max(0, y0 - y1 - 2) };
        })
        .filter((s) => s.h > 0);
      return { label, x: PAD.l + slot * (i + 0.5), w, segs };
    });
  });
}
