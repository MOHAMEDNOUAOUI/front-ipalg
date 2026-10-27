import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Part {
  label: string;
  value: number;
  color: string;
}

/** One segmented bar for a whole split, with its legend as a table underneath. */
@Component({
  selector: 'app-ribbon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar" role="img" [attr.aria-label]="label()" (pointerleave)="on.set(null)">
      @for (p of parts(); track p.label; let i = $index) {
        <span
          class="seg"
          [style.flex-grow]="p.value"
          [style.background]="p.color"
          [class.dim]="on() !== null && on() !== i"
          (pointerenter)="on.set(i)"
        ></span>
      }
    </div>
    <ul class="legend">
      @for (p of parts(); track p.label; let i = $index) {
        <li [class.dim]="on() !== null && on() !== i" (pointerenter)="on.set(i)" (pointerleave)="on.set(null)">
          <i [style.background]="p.color"></i>
          <span class="t">{{ p.label }}</span>
          <b class="num">{{ p.value }}</b>
          <span class="pc num">{{ share(p.value) }} %</span>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }
    .bar {
      display: flex;
      gap: 3px;
      height: 18px;
    }
    .seg {
      flex-basis: 0;
      min-width: 6px;
      border-radius: 6px;
      transition: opacity var(--dur-fast) linear;
    }
    .dim {
      opacity: 0.35;
    }
    .legend {
      list-style: none;
      margin: 18px 0 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 2px 28px;
    }
    li {
      display: grid;
      grid-template-columns: 10px minmax(0, 1fr) auto 42px;
      align-items: center;
      gap: 10px;
      padding: 9px 0;
      border-bottom: 1px solid var(--line);
      font-size: 13.5px;
      color: var(--ink-2);
      transition: opacity var(--dur-fast) linear;
    }
    i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
    .t {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    b {
      font-weight: 650;
      color: var(--ink);
    }
    .pc {
      text-align: right;
      color: var(--ink-3);
    }
  `,
})
export class Ribbon {
  readonly parts = input.required<Part[]>();
  readonly label = input('Répartition');

  protected readonly on = signal<number | null>(null);
  private readonly total = computed(() => this.parts().reduce((s, p) => s + p.value, 0));

  protected share(v: number): number {
    return Math.round((v / (this.total() || 1)) * 100);
  }
}
