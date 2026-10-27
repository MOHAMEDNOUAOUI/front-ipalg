import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Row } from '../../modules/module.types';
import { FLOORS, footprint, templateFor } from './plan-templates';

export type PlanKind = 'masse' | 'etage' | 'facade' | '3d';

function hash(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

const fr = (n: number, d = 0) => n.toFixed(d).replace('.', ',');

/** A sheet drawn like an architect's plan, generated from a property's nature and surface. */
@Component({
  selector: 'app-plan-drawing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 800 560" role="img" [attr.aria-label]="title()" class="sheet">
      <defs>
        <pattern [attr.id]="uid + 'h'" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" class="hatch" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="798" height="558" class="paper" />
      <rect x="14" y="14" width="772" height="532" class="frame" />

      @switch (kind()) {
        @case ('masse') {
          @for (n of m().neighbours; track n.id) {
            <polygon [attr.points]="n.pts" class="nb" />
            <text [attr.x]="n.cx" [attr.y]="n.cy" text-anchor="middle" class="tiny">{{ n.id }}</text>
          }
          <rect x="40" [attr.y]="m().roadY" width="720" height="34" class="road" />
          <line x1="40" x2="760" [attr.y1]="m().roadY + 17" [attr.y2]="m().roadY + 17" class="axis" />
          <text x="400" [attr.y]="m().roadY + 21" text-anchor="middle" class="tiny">{{ m().road }}</text>
          <polygon [attr.points]="m().parcel" class="parcel" />
          @if (m().bati) {
            <rect [attr.x]="m().bati!.x" [attr.y]="m().bati!.y" [attr.width]="m().bati!.w" [attr.height]="m().bati!.h" class="bati" />
            <rect [attr.x]="m().bati!.x" [attr.y]="m().bati!.y" [attr.width]="m().bati!.w" [attr.height]="m().bati!.h" [attr.fill]="'url(#' + uid + 'h)'" />
            <text [attr.x]="m().bati!.x + m().bati!.w / 2" [attr.y]="m().bati!.y + m().bati!.h / 2 + 4" text-anchor="middle" class="lab">Bâtiment</text>
          } @else {
            <text [attr.x]="m().cx" [attr.y]="m().cy" text-anchor="middle" class="lab">Terrain nu</text>
          }
          <text [attr.x]="m().cx" [attr.y]="m().by - 10" text-anchor="middle" class="lab strong">{{ fr(surface()) }} m²</text>
          <ng-container [ngTemplateOutlet]="dims" [ngTemplateOutletContext]="{ w: m().w, h: m().h, x: m().x, y: m().y, wm: m().wM, hm: m().dM }" />
        }
        @case ('etage') {
          @for (r of e().rooms; track r.n) {
            <rect [attr.x]="r.x" [attr.y]="r.y" [attr.width]="r.w" [attr.height]="r.h" class="room" />
          }
          @for (r of e().rooms; track r.n) {
            @if (r.w > 64) {
              <text [attr.x]="r.x + r.w / 2 + r.dx" [attr.y]="r.y + r.h / 2 - 2" text-anchor="middle" class="lab">{{ r.n }}</text>
              <text [attr.x]="r.x + r.w / 2 + r.dx" [attr.y]="r.y + r.h / 2 + 12" text-anchor="middle" class="tiny">{{ r.area }} m²</text>
            }
          }
          @for (d of e().doors; track $index) {
            <path [attr.d]="d.gap" class="gap" />
            <path [attr.d]="d.arc" class="door" />
          }
          @for (w of e().windows; track $index) {
            <line [attr.x1]="w[0]" [attr.y1]="w[1]" [attr.x2]="w[2]" [attr.y2]="w[3]" class="win" />
          }
          <rect [attr.x]="e().x" [attr.y]="e().y" [attr.width]="e().w" [attr.height]="e().h" class="wall" />
          <ng-container [ngTemplateOutlet]="dims" [ngTemplateOutletContext]="{ w: e().w, h: e().h, x: e().x, y: e().y, wm: e().wM, hm: e().dM }" />
        }
        @case ('facade') {
          <line x1="40" x2="760" [attr.y1]="f().ground" [attr.y2]="f().ground" class="ground" />
          <rect [attr.x]="f().x" [attr.y]="f().y" [attr.width]="f().w" [attr.height]="f().h" class="body" />
          <rect [attr.x]="f().x - 6" [attr.y]="f().y - 8" [attr.width]="f().w + 12" height="8" class="roof" />
          @for (w of f().windows; track $index) {
            <rect [attr.x]="w.x" [attr.y]="w.y" [attr.width]="w.w" [attr.height]="w.h" class="glass" />
          }
          <rect [attr.x]="f().door.x" [attr.y]="f().door.y" [attr.width]="f().door.w" [attr.height]="f().door.h" class="entry" />
          @for (l of f().levels; track l.label) {
            <line [attr.x1]="f().x - 30" [attr.x2]="f().x + f().w + 30" [attr.y1]="l.y" [attr.y2]="l.y" class="level" />
            <text [attr.x]="f().x - 36" [attr.y]="l.y - 4" text-anchor="end" class="tiny">{{ l.label }}</text>
          }
          <text x="400" y="486" text-anchor="middle" class="lab strong">Façade principale</text>
        }
      }

      @if (kind() !== 'facade') {
        <g transform="translate(730 60)">
          <circle r="20" class="north" />
          <path d="M0 -17 L7 8 L0 3 L-7 8 Z" class="arrow" />
          <text y="-24" text-anchor="middle" class="tiny strong">N</text>
        </g>
        <g [attr.transform]="'translate(40 ' + 486 + ')'">
          <line x1="0" y1="0" [attr.x2]="bar().px" y2="0" class="barline" />
          <line x1="0" y1="-4" x2="0" y2="4" class="barline" />
          <line [attr.x1]="bar().px" y1="-4" [attr.x2]="bar().px" y2="4" class="barline" />
          <text x="0" y="16" class="tiny">0</text>
          <text [attr.x]="bar().px" y="16" text-anchor="middle" class="tiny">{{ bar().m }} m</text>
        </g>
      }

      <g transform="translate(470 480)">
        <rect width="304" height="58" class="cart" />
        <text x="12" y="20" class="lab strong">{{ name() }}</text>
        <text x="12" y="36" class="tiny">{{ titre() }} · {{ fr(surface()) }} m² · {{ sheet() }}</text>
        <text x="12" y="50" class="tiny">Document de démonstration</text>
      </g>
  <ng-template #dims let-w="w" let-h="h" let-x="x" let-y="y" let-wm="wm" let-hm="hm">
      <g class="dim">
        <line [attr.x1]="x" [attr.x2]="x + w" [attr.y1]="y - 16" [attr.y2]="y - 16" />
        <line [attr.x1]="x" [attr.x2]="x" [attr.y1]="y - 22" [attr.y2]="y - 10" />
        <line [attr.x1]="x + w" [attr.x2]="x + w" [attr.y1]="y - 22" [attr.y2]="y - 10" />
        <text [attr.x]="x + w / 2" [attr.y]="y - 21" text-anchor="middle" class="tiny strong">{{ fr(wm, 1) }} m</text>
        <line [attr.x1]="x - 16" [attr.x2]="x - 16" [attr.y1]="y" [attr.y2]="y + h" />
        <line [attr.x1]="x - 22" [attr.x2]="x - 10" [attr.y1]="y" [attr.y2]="y" />
        <line [attr.x1]="x - 22" [attr.x2]="x - 10" [attr.y1]="y + h" [attr.y2]="y + h" />
        <text [attr.transform]="'translate(' + (x - 21) + ' ' + (y + h / 2) + ') rotate(-90)'" text-anchor="middle" class="tiny strong">{{ fr(hm, 1) }} m</text>
      </g>
    </ng-template>
    </svg>

  `,
  styles: `
    :host {
      display: block;
    }
    .sheet {
      display: block;
      width: 100%;
      height: auto;
      font-family: inherit;
    }
    .paper {
      fill: #fff;
    }
    .frame {
      fill: none;
      stroke: #14202b;
      stroke-width: 1.2;
    }
    .hatch {
      stroke: #043d6d;
      stroke-width: 1;
      opacity: 0.35;
    }
    .nb {
      fill: #f1f4f8;
      stroke: #aab6c3;
      stroke-width: 1;
    }
    .road {
      fill: #e9edf2;
    }
    .axis {
      stroke: #fff;
      stroke-width: 1.6;
      stroke-dasharray: 10 8;
    }
    .parcel {
      fill: #f7fbff;
      stroke: #043d6d;
      stroke-width: 2.4;
      stroke-dasharray: 14 4 3 4;
    }
    .bati {
      fill: #fff;
      stroke: #14202b;
      stroke-width: 2.4;
    }
    .room {
      fill: #fff;
      stroke: #14202b;
      stroke-width: 2.2;
    }
    .wall {
      fill: none;
      stroke: #14202b;
      stroke-width: 6;
    }
    .gap {
      stroke: #fff;
      stroke-width: 4;
      fill: none;
    }
    .door {
      stroke: #14202b;
      stroke-width: 1.2;
      fill: none;
    }
    .win {
      stroke: #06adb9;
      stroke-width: 4;
    }
    .body {
      fill: #f7fbff;
      stroke: #14202b;
      stroke-width: 2.4;
    }
    .roof {
      fill: #14202b;
    }
    .glass {
      fill: #cfeef1;
      stroke: #14202b;
      stroke-width: 1.4;
    }
    .entry {
      fill: #043d6d;
    }
    .ground {
      stroke: #14202b;
      stroke-width: 3;
    }
    .level {
      stroke: #8a9bb0;
      stroke-width: 1;
      stroke-dasharray: 8 4 2 4;
    }
    .dim line {
      stroke: #043d6d;
      stroke-width: 1.2;
    }
    .north {
      fill: none;
      stroke: #14202b;
      stroke-width: 1.2;
    }
    .arrow {
      fill: #14202b;
    }
    .barline {
      stroke: #14202b;
      stroke-width: 2;
    }
    .cart {
      fill: #fff;
      stroke: #14202b;
      stroke-width: 1.2;
    }
    .lab {
      font-size: 12px;
      fill: #14202b;
    }
    .tiny {
      font-size: 10.5px;
      fill: #5d6b79;
    }
    .strong {
      font-weight: 700;
    }
    .dim .tiny {
      fill: #043d6d;
    }
  `,
  imports: [NgTemplateOutlet],
})
export class PlanDrawing {
  readonly kind = input.required<PlanKind>();
  readonly row = input.required<Row>();

  protected readonly fr = fr;
  protected readonly uid = `p${Math.random().toString(36).slice(2, 7)}`;

  protected readonly name = computed(() => String(this.row()['designation'] ?? ''));
  protected readonly titre = computed(() => String(this.row()['titre'] ?? ''));
  protected readonly surface = computed(() => Number(this.row()['surface']) || 300);
  protected readonly nature = computed(() => String(this.row()['nature'] ?? ''));
  protected readonly title = computed(() => {
    const k = this.kind();
    return `${k === 'masse' ? 'Plan de masse' : k === 'etage' ? 'Plan d’étage' : 'Façade'} de ${this.name()}`;
  });
  protected readonly sheet = computed(() => (this.kind() === 'masse' ? 'Plan de masse' : this.kind() === 'etage' ? 'Plan RDC' : 'Façade'));
  private readonly seed = computed(() => hash(String(this.row().id)));

  /** Scale bar: a round length that is 60 to 140 px long on the sheet. */
  protected readonly bar = computed(() => {
    const sc = this.kind() === 'masse' ? this.m().sc : this.e().sc;
    const m = [2, 5, 10, 20, 50, 100].find((v) => v * sc >= 60) ?? 100;
    return { m, px: m * sc };
  });

  protected readonly m = computed(() => {
    const S = this.surface();
    const wM = Math.sqrt(S * 1.5);
    const dM = S / wM;
    const sc = Math.min(520 / wM, 300 / dM);
    const w = wM * sc;
    const h = dM * sc;
    const x = 400 - w / 2;
    const y = 120;
    const j = (k: number) => ((((this.seed() >> k) & 7) - 3.5) / 3.5) * 0.035;
    const P: [number, number][] = [
      [x + w * j(1), y + h * j(2)],
      [x + w * (1 + j(3)), y + h * j(4)],
      [x + w * (1 + j(5)), y + h * (1 + j(6))],
      [x + w * j(7), y + h * (1 + j(8))],
    ];
    const bat = this.nature() !== 'Terrain';
    const roadY = y + h + 24;
    const ids = ['TF 4821/C', 'TF 9140/C', 'TF 7765/C'];
    const neighbours: { id: string; pts: string; cx: number; cy: number }[] = [];
    const left = x - 18 - 40;
    if (left > 50) neighbours.push({ id: ids[0], pts: `40,${y} ${x - 18},${y} ${x - 18},${y + h} 40,${y + h}`, cx: (40 + x - 18) / 2, cy: y + h / 2 });
    const rx = x + w + 18;
    if (760 - rx > 50) neighbours.push({ id: ids[1], pts: `${rx},${y} 760,${y} 760,${y + h} ${rx},${y + h}`, cx: (rx + 760) / 2, cy: y + h / 2 });
    return {
      sc,
      x,
      y,
      w,
      h,
      wM,
      dM,
      by: y + h * 0.18,
      cx: x + w / 2,
      cy: y + h / 2 + 4,
      parcel: P.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '),
      bati: bat ? { x: x + w * 0.2, y: y + h * 0.26, w: w * 0.6, h: h * 0.5 } : null,
      roadY: Math.min(roadY, 440),
      road: `Rue principale, ${this.row()['ville'] ?? ''}`,
      neighbours,
    };
  });

  protected readonly e = computed(() => {
    const nat = this.nature();
    const { wM, dM } = footprint(this.surface(), nat);
    const sc = Math.min(600 / wM, 330 / dM);
    const w = wM * sc;
    const h = dM * sc;
    const x = 400 - w / 2;
    const y = 112;
    const tpl = templateFor(nat);
    const rooms = tpl.map((t) => ({
      n: t.n,
      x: x + t.x * w,
      y: y + t.y * h,
      w: t.w * w,
      h: t.h * h,
      area: Math.round(t.w * wM * t.h * dM),
      dx: t.x > 0.001 ? Math.min(0.9 * sc, 34) / 2 : 0,
      t,
    }));
    const D = Math.min(0.9 * sc, 34);
    const doors: { gap: string; arc: string }[] = [];
    const windows: [number, number, number, number][] = [];
    rooms.forEach((r, i) => {
      const t = r.t;
      if (t.x > 0.001) {
        const yc = r.y + r.h / 2;
        doors.push({
          gap: `M${r.x},${yc - D / 2} L${r.x},${yc + D / 2}`,
          arc: `M${r.x},${yc - D / 2} L${r.x + D},${yc - D / 2} A${D},${D} 0 0 1 ${r.x},${yc + D / 2}`,
        });
      } else if (t.y > 0.001) {
        const xc = r.x + r.w / 2;
        doors.push({
          gap: `M${xc - D / 2},${r.y} L${xc + D / 2},${r.y}`,
          arc: `M${xc - D / 2},${r.y} L${xc - D / 2},${r.y + D} A${D},${D} 0 0 0 ${xc + D / 2},${r.y}`,
        });
      } else if (i === 0) {
        const xc = r.x + r.w / 2;
        doors.push({
          gap: `M${xc - D / 2},${r.y} L${xc + D / 2},${r.y}`,
          arc: `M${xc - D / 2},${r.y} L${xc - D / 2},${r.y + D} A${D},${D} 0 0 0 ${xc + D / 2},${r.y}`,
        });
      }
      const k = 0.3;
      if (t.y < 0.001 && r.w > 50) windows.push([r.x + r.w * k, r.y, r.x + r.w * (1 - k), r.y]);
      if (t.y + t.h > 0.999 && r.w > 50) windows.push([r.x + r.w * k, r.y + r.h, r.x + r.w * (1 - k), r.y + r.h]);
      if (t.x + t.w > 0.999) windows.push([r.x + r.w, r.y + r.h * k, r.x + r.w, r.y + r.h * (1 - k)]);
      if (t.x < 0.001) windows.push([r.x, r.y + r.h * k, r.x, r.y + r.h * (1 - k)]);
    });
    return { sc, x, y, w, h, wM, dM, rooms, doors, windows };
  });

  protected readonly f = computed(() => {
    const nat = this.nature();
    const floors = FLOORS[nat] ?? 2;
    const wM = Math.sqrt((Math.max(60, this.surface() / floors)) * 1.7);
    const hM = 4 + (floors - 1) * 3.2;
    const sc = Math.min(560 / wM, 330 / hM);
    const w = wM * sc;
    const h = hM * sc;
    const x = 400 - w / 2;
    const ground = 440;
    const y = ground - h;
    const cols = Math.max(3, Math.min(12, Math.round(wM / 3.4)));
    const cw = w / cols;
    const windows: { x: number; y: number; w: number; h: number }[] = [];
    const levels: { label: string; y: number }[] = [{ label: '+0,00', y: ground }];
    for (let fl = 0; fl < floors; fl++) {
      const top = ground - (fl === 0 ? 4 : 4 + fl * 3.2) * sc;
      const bottom = ground - (fl === 0 ? 0 : 4 + (fl - 1) * 3.2) * sc;
      if (fl > 0) levels.push({ label: `+${fr(4 + (fl - 1) * 3.2, 2)}`, y: bottom });
      for (let c = 0; c < cols; c++) {
        if (fl === 0 && c === Math.floor(cols / 2)) continue;
        const ww = cw * 0.42;
        windows.push({ x: x + c * cw + (cw - ww) / 2, y: top + (bottom - top) * 0.28, w: ww, h: (bottom - top) * (fl === 0 ? 0.45 : 0.5) });
      }
    }
    const dw = cw * 0.55;
    return {
      x,
      y,
      w,
      h,
      ground,
      windows,
      levels,
      door: { x: x + Math.floor(cols / 2) * cw + (cw - dw) / 2, y: ground - 2.7 * sc, w: dw, h: 2.7 * sc },
    };
  });
}
