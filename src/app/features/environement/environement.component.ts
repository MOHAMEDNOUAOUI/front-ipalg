import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

interface Section {
  label: string;
  route: string;
  icon: string;
  description: string;
}

interface SectionGroup {
  title: string;
  sections: Section[];
}

/** Setup area: the reference data other modules draw their choices, rules and fields from. */
@Component({
  selector: 'app-environement',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgIcon],
  templateUrl: './environement.component.html',
  styleUrl: './environement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironementComponent {
  protected readonly groups: SectionGroup[] = [
    {
      title: 'Accès',
      sections: [
        {
          label: 'Profils et permissions',
          route: 'profils',
          icon: 'tablerShieldLock',
          description: 'Qui peut voir et faire quoi dans chaque module',
        },
      ],
    },
    {
      title: 'Référentiels',
      sections: [
        {
          label: 'Catégories',
          route: 'categories',
          icon: 'tablerListDetails',
          description: 'Catégories de biens et de documents',
        },
        {
          label: 'Types de documents',
          route: 'documents',
          icon: 'tablerFileStack',
          description: 'Actes, plans, contrats et leurs règles de validité',
        },
        {
          label: 'Listes de valeurs',
          route: 'listes-valeurs',
          icon: 'tablerListDetails',
          description: 'Les choix proposés dans les formulaires',
        },
      ],
    },
    {
      title: 'Personnalisation',
      sections: [
        {
          label: 'Champs personnalisés',
          route: 'champs-personalises',
          icon: 'tablerListDetails',
          description: 'Champs ajoutés aux fiches de chaque module',
        },
        {
          label: 'Variables globales',
          route: 'variables-globales',
          icon: 'tablerListDetails',
          description: 'Taux, seuils et délais utilisés partout',
        },
      ],
    },
  ];
}
