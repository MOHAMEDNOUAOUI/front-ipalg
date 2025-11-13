import { Component } from '@angular/core';
import { ReusableTableComponent } from "../../../../shared/reusable-table/reusable-table.component";
import { TableCategories } from "../../../../components/table-categories/table-categories";
import { CategorieStore } from '../../../../store/categories.store';

@Component({
  selector: 'app-categories',
  imports: [ReusableTableComponent, TableCategories],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
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

  constructor(public CategorieStore: CategorieStore){

  }

}
