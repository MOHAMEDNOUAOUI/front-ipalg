import { Component } from '@angular/core';
import { ReusableTableComponent } from '../../../../shared/reusable-table/reusable-table.component';

@Component({
  selector: 'app-categories',
  imports: [ReusableTableComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
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
      active: true,
    },
    {
      label: 'Description',
      value: 'description',
      bold: false,
      active: true,
    },
    {
      label: 'Permissions',
      value: 'permissionsCount',
      bold: false,
      active: true,
    },
    {
      label: 'Utilisateurs',
      value: 'utilisateursCount',
      bold: false,
      active: true,
    },
    {
      label: 'Created By',
      value: 'createdBy',
      bold: false,
      active: true,
    },
  ];

  constructor() {}
}
