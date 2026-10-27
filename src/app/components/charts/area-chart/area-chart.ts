import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface LineSeries {
  name: string;
  color: string;
  values: (number | null)[];
  dashed?: boolean;
  /** Fill under the line with a flat tint. */
  area?: boolean;
}

const W = 640;
const PAD = { l: 40, r: 12, t: 14, b: 28 };

/** Smooth monotone path through the points, so the curve never overshoots the data. */
function smooth(p: [number, number][]): string {
  const n = p.length;
  if (n < 2) return '';
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(p[i + 1][0] - p[i][0]);
    m.push((p[i + 1][1] - p[i][1]) / dx[i]);
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const c = dx[i] / 3;
    d += `C${(p[i][0] + c).toFixed(1)},${(p[i][1] + t[i] * c).toFixed(1)} ${(p[i + 1][0] - c).toFixed(1)},${(p[i + 1][1] - t[i + 1] * c).toFixed(1)} ${p[i + 1][0].toFixed(1)},${p[i + 1][1].toFixed(1)}`;
  }
  return d;
}

/** Line and area chart with a hover read-out; flat colours only. */
@Component({
  selector: 'app-area-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" (pointerleave)="hover.set(null)">
      <svg
        [attr.viewBox]="'0 0 ' + W + ' ' + height()"
        role="img"
        [attr.aria-label]="label()"
        (pointermove)="move($event)"
      >
        @for (t of ticks(); track t.label) {
          <line [attr.x1]="pad.l" [attr.x2]="W - pad.r" [attr.y1]="t.y" [attr.y2]="t.y" class="grid" />
          <text [attr.x]="pad.l - 8" [attr.y]="t.y + 4" text-anchor="end" class="axis">{{ t.label }}</text>
        }
        @for (c of cols(); track c.label; let i = $index) {
          <text [attr.x]="c.x" [attr.y]="height() - 8" text-anchor="middle" class="axis" [class.on]="hover() === i">{{ c.label }}</text>
        }
        @for (s of paths(); track s.name) {
          @if (s.area) {
            <path [attr.d]="s.fill" [attr.fill]="s.color" class="fill" />
          }
          <path [attr.d]="s.line" [attr.stroke]="s.color" [class.dashed]="s.dashed" class="line" fill="none" />
        }
        @if (hover() !== null) {
          <line [attr.x1]="cols()[hover()!].x" [attr.x2]="cols()[hover()!].x" [attr.y1]="pad.t" [attr.y2]="height() - pad.b" class="cursor" />
          @for (s of paths(); track s.name) {
            @if (s.dots[hover()!]; as d) {
              <circle [attr.cx]="d[0]" [attr.cy]="d[1]" r="5" [attr.stroke]="s.color" class="dot" />
            }
          }
        } @else {
          @for (s of paths(); track s.name) {
            @if (s.area && s.end) {
              <circle [attr.cx]="s.end[0]" [attr.cy]="s.end[1]" r="5" [attr.stroke]="s.color" class="dot" />
            }
          }
        }
      </svg>
      @if (hover() !== null) {
        <div class="tip" [style.left.%]="(cols()[hover()!].x / W) * 100" [class.flip]="hover()! > cols().length / 2">
          <strong>{{ cols()[hover()!].label }}</strong>
          @for (s of series(); track s.name) {
            @if (s.values[hover()!] !== null && s.values[hover()!] !== undefined) {
              <span><i [style.background]="s.color"></i>{{ s.name }}<b class="num">{{ fmt(s.values[hover()!]!) }}</b></span>
            }
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
      touch-action: pan-y;
    }
    .grid {
      stroke: var(--line);
      stroke-dasharray: 2 4;
    }
    .axis {
      font-size: 11px;
      fill: var(--ink-3);
      transition: fill var(--dur-fast) linear;
    }
    .axis.on {
      fill: var(--ink);
      font-weight: 600;
    }
    .line {
      stroke-width: 2.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .line.dashed {
      stroke-width: 1.6;
      stroke-dasharray: 5 5;
      opacity: 0.75;
    }
    .fill {
      opacity: 0.1;
    }
    .cursor {
      stroke: var(--line-strong);
      stroke-width: 1;
    }
    .dot {
      fill: var(--surface);
      stroke-width: 2.4;
    }
    .tip {
      position: absolute;
      top: 6px;
      transform: translateX(14px);
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
      transform: translateX(calc(-100% - 14px));
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
      font-weight: 600;
    }
  `,
})
export class AreaChart {
  readonly labels = input.required<string[]>();
  readonly series = input.required<LineSeries[]>();
  readonly min = input(0);
  readonly max = input(10);
  readonly step = input(2);
  readonly height = input(300);
  readonly unit = input('');
  readonly label = input('Graphique');

  protected readonly W = W;
  protected readonly pad = PAD;
  protected readonly hover = signal<number | null>(null);

  protected readonly cols = computed(() =>
    this.labels().map((label, i, a) => ({
      label,
      x: PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, a.length - 1),
    }))
  );

  private readonly y = computed(() => {
    const h = this.height();
    const [lo, hi] = [this.min(), this.max()];
    return (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * (h - PAD.t - PAD.b);
  });

  protected readonly ticks = computed(() => {
    const out: { label: string; y: number }[] = [];
    for (let v = this.min(); v <= this.max() + 1e-9; v += this.step()) {
      out.push({ label: String(+v.toFixed(2)).replace('.', ','), y: this.y()(v) });
    }
    return out;
  });

  protected readonly paths = computed(() => {
    const y = this.y();
    const base = this.height() - PAD.b;
    return this.series().map((s) => {
      const dots = this.cols().map((c, i): [number, number] | null =>
        s.values[i] === null || s.values[i] === undefined ? null : [c.x, y(s.values[i]!)]
      );
      const pts = dots.filter((d): d is [number, number] => d !== null);
      const line = smooth(pts);
      const end = pts[pts.length - 1];
      return {
        ...s,
        dots,
        line,
        end,
        fill: pts.length ? `${line}L${pts[pts.length - 1][0]},${base}L${pts[0][0]},${base}Z` : '',
      };
    });
  });

  protected fmt(v: number): string {
    return `${String(v).replace('.', ',')}${this.unit() ? ' ' + this.unit() : ''}`;
  }

  protected move(e: PointerEvent) {
    const box = (e.currentTarget as SVGElement).getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    const c = this.cols();
    let best = 0;
    for (let i = 1; i < c.length; i++) if (Math.abs(c[i].x - x) < Math.abs(c[best].x - x)) best = i;
    this.hover.set(best);
  }
}
