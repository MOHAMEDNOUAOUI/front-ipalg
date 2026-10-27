import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NAV_GROUPS } from '../../../../config/navigation';

/** Enables or disables whole modules. Local state only until a settings API exists. */
@Component({
  selector: 'app-modules',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="list">
      @for (m of modules; track m.id) {
      <li>
        <div class="text">
          <strong>{{ m.header }}</strong>
          <span>{{ m.links }}</span>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            role="switch"
            [checked]="enabled()[m.id]"
            [disabled]="m.locked"
            (change)="toggle(m.id)"
          />
          <span>{{ enabled()[m.id] ? 'Activé' : 'Désactivé' }}</span>
        </label>
      </li>
      }
    </ul>
    <p class="note">Les modifications ne sont pas encore sauvegardées côté serveur.</p>
  `,
  styles: `
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: var(--radius);
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 16px;

      & + li {
        border-top: 1px solid var(--line);
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;

      strong {
        font-size: 14.5px;
        color: var(--ink);
      }
      span {
        font-size: 13px;
        color: var(--ink-3);
      }
    }
    .switch {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: var(--ink-2);
      white-space: nowrap;
      cursor: pointer;
    }
    .note {
      margin-top: 12px;
      font-size: 13px;
      color: var(--ink-3);
    }
  `,
})
export class Modules {
  protected readonly modules = NAV_GROUPS.map((g) => ({
    id: g.id,
    header: g.header,
    links: g.links.map((l) => l.label).join(' · '),
    // Pilotage and Administration are needed to use or configure the app at all.
    locked: g.id === 'pilotage' || g.id === 'administration',
  }));
  protected readonly enabled = signal<Record<string, boolean>>(
    Object.fromEntries(NAV_GROUPS.map((g) => [g.id, true]))
  );

  protected toggle(id: string) {
    this.enabled.update((e) => ({ ...e, [id]: !e[id] }));
  }
}
