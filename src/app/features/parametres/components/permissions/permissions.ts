import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NAV_GROUPS } from '../../../../config/navigation';

const PROFILS = ['Administrateur', 'Gestionnaire patrimoine', 'Juriste', 'Lecteur'];
const LEVELS = ['Aucun', 'Lecture', 'Écriture'] as const;
type Level = (typeof LEVELS)[number];

const DEFAULTS: Record<string, Level[]> = {
  pilotage: ['Écriture', 'Écriture', 'Lecture', 'Lecture'],
  patrimoine: ['Écriture', 'Écriture', 'Lecture', 'Lecture'],
  location: ['Écriture', 'Écriture', 'Lecture', 'Lecture'],
  finance: ['Écriture', 'Lecture', 'Aucun', 'Lecture'],
  projets: ['Écriture', 'Écriture', 'Aucun', 'Lecture'],
  documents: ['Écriture', 'Écriture', 'Écriture', 'Lecture'],
  administration: ['Écriture', 'Aucun', 'Aucun', 'Aucun'],
};

/** Rights matrix: one level per profile and module. Local state only until a permissions API exists. */
@Component({
  selector: 'app-permissions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <table>
        <caption class="sr-only">Droits par profil et par module</caption>
        <thead>
          <tr>
            <th scope="col">Module</th>
            @for (p of profils; track p) {
            <th scope="col">{{ p }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (m of modules; track m.id) {
          <tr>
            <th scope="row">{{ m.header }}</th>
            @for (p of profils; track p; let i = $index) {
            <td>
              <select
                [attr.aria-label]="m.header + ', ' + p"
                [attr.data-level]="matrix()[m.id][i]"
                [disabled]="locked(m.id, i)"
                (change)="set(m.id, i, $any($event.target).value)"
              >
                @for (l of levels; track l) {
                <option [value]="l" [selected]="matrix()[m.id][i] === l">{{ l }}</option>
                }
              </select>
            </td>
            }
          </tr>
          }
        </tbody>
      </table>
    </div>
    <p class="note">
      L’administrateur garde l’accès complet à l’administration. Les modifications ne sont pas encore
      sauvegardées côté serveur.
    </p>
  `,
  styles: `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }
    .wrap {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: var(--radius);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th,
    td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--line);
    }
    thead th {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--ink-2);
      background: var(--surface-sunken);
      white-space: nowrap;
    }
    tbody th {
      font-weight: 500;
      color: var(--ink);
    }
    tbody tr:last-child > * {
      border-bottom: 0;
    }
    select {
      width: 100%;
      min-width: 110px;
      padding: 6px 8px;
      font: inherit;
      font-size: 13.5px;
      color: var(--ink);
      background: var(--surface);
      border: 1px solid var(--line-strong);
      border-radius: var(--radius-sm);

      &[data-level='Écriture'] {
        color: var(--success-ink);
        background: var(--success-bg);
        border-color: transparent;
      }
      &[data-level='Aucun'] {
        color: var(--ink-3);
      }
      &:disabled {
        opacity: 0.7;
      }
      &:focus-visible {
        outline: 2px solid var(--brand-mid);
        outline-offset: 2px;
      }
    }
    .note {
      margin-top: 12px;
      max-width: 70ch;
      font-size: 13px;
      color: var(--ink-3);
    }
  `,
})
export class Permissions {
  protected readonly profils = PROFILS;
  protected readonly levels = LEVELS;
  protected readonly modules = NAV_GROUPS.map((g) => ({ id: g.id, header: g.header }));
  protected readonly matrix = signal<Record<string, Level[]>>(
    Object.fromEntries(Object.entries(DEFAULTS).map(([k, v]) => [k, [...v]]))
  );

  protected locked(module: string, profil: number) {
    return profil === 0 && module === 'administration';
  }

  protected set(module: string, profil: number, level: Level) {
    this.matrix.update((m) => ({ ...m, [module]: m[module].map((l, i) => (i === profil ? level : l)) }));
  }
}
