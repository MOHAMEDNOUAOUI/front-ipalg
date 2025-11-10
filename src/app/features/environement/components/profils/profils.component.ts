import { Component } from '@angular/core';
import { PButtonComponent } from '../../../../shared/p-button/p-button.component';
import { StepsHeaderComponent } from '../../../../shared/steps-header/steps-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { step } from '../../../../interfaces/sidepanel-tabs';
import { TableUsersComponent } from '../../../../components/table-users/table-users.component';
import { ReusableTableComponent } from '../../../../shared/reusable-table/reusable-table.component';
import { ProfileStore } from '../../../../store/profile.store';

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

  totalPages: number = 10;
  currentPage: number = 0;
  size = 10;
  totalElements = 2;
  columns = [
    {
      label: 'Username',
      value: 'username',
      active: true,
    },
    {
      label: 'Profile',
      value: 'label',
      bold: true,
    },
    {
      label: 'Description',
      value: 'description',
      bold: false,
    },
    {
      label: 'Permissions',
      value: 'permissionsCount',
      bold: false,
    },
    {
      label: 'Utilisateurs',
      value: 'utilisateursCount',
      bold: false,
    },
    {
      label: 'Created By',
      value: 'createdBy',
      bold: false,
    },
  ];
  data = [
    {
      id: 1,
      label: 'Admnistrateur',
      description: 'test description',
      permissionsCount: 5,
      utilisateursCount: 2,
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: 2,
      label: 'Moderateur',
      description: 'test description',
      permissionsCount: 2,
      utilisateursCount: 10,
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
  ];

  constructor(public profileStore: ProfileStore) {}
}
