import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Open ring gauge: 270 degrees of track with a rounded value arc. */
@Component({
  selector: 'app-gauge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g">
      <svg viewBox="0 0 200 180" role="img" [attr.aria-label]="label() + ' : ' + value() + ' %'">
        <circle cx="100" cy="100" r="76" class="track" [attr.stroke-dasharray]="arc + ' ' + circ" transform="rotate(135 100 100)" />
        <circle cx="100" cy="100" r="76" class="val" [attr.stroke-dasharray]="dash() + ' ' + circ" transform="rotate(135 100 100)" />
      </svg>
      <div class="in">
        <span class="n num">{{ value() }}<small>%</small></span>
        <span class="l">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .g {
      position: relative;
      width: min(100%, 230px);
      margin: 0 auto;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    circle {
      fill: none;
      stroke-width: 14;
      stroke-linecap: round;
    }
    .track {
      stroke: var(--surface-sunken);
    }
    .val {
      stroke: var(--brand);
      transition: stroke-dasharray var(--dur) var(--ease-out);
    }
    .in {
      position: absolute;
      inset: 0 0 14% 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .n {
      font-size: 38px;
      font-weight: 650;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--ink);
    }
    .n small {
      margin-left: 2px;
      font-size: 18px;
      font-weight: 500;
      color: var(--ink-3);
    }
    .l {
      margin-top: 4px;
      font-size: 12.5px;
      color: var(--ink-3);
    }
  `,
})
export class Gauge {
  readonly value = input.required<number>();
  readonly label = input('');

  protected readonly circ = 2 * Math.PI * 76;
  protected readonly arc = this.circ * 0.75;
  protected readonly dash = computed(() => (this.arc * Math.max(0, Math.min(100, this.value()))) / 100);
}
