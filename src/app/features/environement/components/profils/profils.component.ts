import { Component } from '@angular/core';
import { PButtonComponent } from '../../../../shared/p-button/p-button.component';
import { StepsHeaderComponent } from '../../../../shared/steps-header/steps-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { ProfileStore } from '../../../../store/profile.store';
import { EllipsisInterface } from '../../../../interfaces/Table-helper';
import { GenericTableComponent } from '../../../../components/generic-table/generic-table.component';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [
    PButtonComponent,
    StepsHeaderComponent,
    CommonModule,
    RouterModule,
    GenericTableComponent,
    PaginationComponent,
  ],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.scss',
})
export class ProfilsComponent {
  // steps: step[] = [
  //   {
  //     label: 'Profils',
  //     route: 'prf',
  //   },
  //   {
  //     label: 'Permission',
  //     route: 'test',
  //   },
  // ];

  items: EllipsisInterface[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      action: 'UPDATE',
      class: 'button-modifier',
      command: () => this.modifierProfil(),
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      action: 'DELETE',
      class: 'button-supprimer',
      command: () => this.deleteProfil(),
    },
    {
      label: 'Consulter',
      icon: 'pi pi-eye',
      action: 'DETAILS',
      class: 'button-consulter',
      command: () => this.deleteProfil(),
    },
  ];

  constructor(public profileStore: ProfileStore) {}

  modifierProfil() {
    // Logic to modify profile
    alert(this.profileStore.selectedData()?.id);
  }
  deleteProfil() {
    alert(this.profileStore.selectedData()?.label);
    // Logic to delete profile
  }
  changePage(page: number) {
    this.profileStore.updateFilter({ page: page });
  }

  actionsDistributor(action: string) {
    switch (action) {
      case 'UPDATE':
        this.modifierProfil();
        break;
      case 'DELETE':
        this.deleteProfil();
        break;
      case 'DETAILS':
        // this.consulterProfil();
        break;
      default:
        break;
    }
  }
}
