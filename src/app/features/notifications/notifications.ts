import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

type Level = 'urgent' | 'soon' | 'info';

interface Alerte {
  id: number;
  level: Level;
  title: string;
  where: string;
  when: string;
  route: string;
  icon: string;
  read: boolean;
}

const LEVELS: { value: Level | ''; label: string }[] = [
  { value: '', label: 'Toutes' },
  { value: 'urgent', label: 'Urgentes' },
  { value: 'soon', label: 'À venir' },
  { value: 'info', label: 'Information' },
];

/** Demo alerts, consistent with the demo data of the list modules. */
const ALERTES: Alerte[] = [
  { id: 1, level: 'urgent', title: 'Loyer d’octobre impayé', where: 'BD-2019-009 · Pharmacie Gauthier', when: 'En retard de 21 jours', route: 'location/echeancier', icon: 'tablerCalendarDue', read: false },
  { id: 2, level: 'urgent', title: 'Opposition reçue sur une réquisition', where: 'REQ-2026-005 · Lot Nouaceur 21', when: 'Réponse sous 2 mois', route: 'patrimoine/requisitions', icon: 'tablerMapPin', read: false },
  { id: 3, level: 'urgent', title: 'Panne climatisation salle des coffres', where: 'OM-2026-188 · Agence Maârif', when: 'Échéance le 29 oct.', route: 'maintenance', icon: 'tablerTools', read: false },
  { id: 4, level: 'soon', title: 'Bail arrivant à échéance', where: 'BD-2019-009 · Immeuble Gauthier', when: 'Dans 35 jours', route: 'location/baux-donnes', icon: 'tablerHome2', read: false },
  { id: 5, level: 'soon', title: 'Audience au tribunal', where: 'LIT-2026-006 · Bornage contesté Anfa', when: 'Le 12 nov.', route: 'patrimoine/litiges', icon: 'tablerGavel', read: false },
  { id: 6, level: 'soon', title: 'Signature chez le notaire', where: 'CES-2026-004 · Entrepôt Ain Sebaâ', when: 'Le 20 nov.', route: 'patrimoine/cessions', icon: 'tablerArrowsExchange', read: true },
  { id: 7, level: 'soon', title: 'Réception à prononcer, 7 réserves ouvertes', where: 'PRJ-2026-003 · Agence Technopolis', when: 'Le 15 nov.', route: 'projets', icon: 'tablerSitemap', read: true },
  { id: 8, level: 'soon', title: 'Document à vérifier', where: 'DOC-01240 · Autorisation de construire Tamesna', when: 'Validité à confirmer', route: 'ged', icon: 'tablerFileStack', read: true },
  { id: 9, level: 'info', title: 'Proposition en attente de commission', where: 'PRP-2026-041 · Local Boulevard Zerktouni', when: 'Déposée le 2 oct.', route: 'patrimoine/propositions', icon: 'tablerClipboardList', read: true },
  { id: 10, level: 'info', title: 'Écart d’expertise détecté', where: 'Immeuble Gauthier · +18 % sur la valeur nette', when: 'Réévaluation à décider', route: 'finance/amortissements', icon: 'tablerCalculator', read: true },
];

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  protected readonly levels = LEVELS;
  protected readonly items = signal<Alerte[]>(ALERTES);
  protected readonly level = signal<Level | ''>('');
  protected readonly onlyUnread = signal(false);

  protected readonly unread = computed(() => this.items().filter((a) => !a.read).length);
  protected readonly visible = computed(() =>
    this.items().filter(
      (a) => (!this.level() || a.level === this.level()) && (!this.onlyUnread() || !a.read)
    )
  );

  protected countOf(level: Level | '') {
    return this.items().filter((a) => !level || a.level === level).length;
  }

  protected markRead(id: number) {
    this.items.update((l) => l.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }

  protected markAllRead() {
    this.items.update((l) => l.map((a) => ({ ...a, read: true })));
  }
}
