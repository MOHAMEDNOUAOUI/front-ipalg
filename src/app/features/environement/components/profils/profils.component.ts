import { Component } from '@angular/core';
import { PButtonComponent } from '../../../../shared/p-button/p-button.component';
import { StepsHeaderComponent } from '../../../../shared/steps-header/steps-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { step } from '../../../../interfaces/sidepanel-tabs';
import { TableUsersComponent } from '../../../../components/table-users/table-users.component';
import { ReusableTableComponent } from '../../../../shared/reusable-table/reusable-table.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { ProfileStore } from '../../../../store/profile.store';
import { EllipsisInterface } from '../../../../interfaces/Table-helper';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [
    PButtonComponent,
    StepsHeaderComponent,
    CommonModule,
    RouterModule,
    TableUsersComponent,
    ReusableTableComponent,
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
  }
  deleteProfil() {
    // Logic to delete profile
  }
  changePage(page: number) {
    this.profileStore.updateFilter({ page: page });
  }
}
