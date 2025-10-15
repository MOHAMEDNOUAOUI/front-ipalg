import { Component } from '@angular/core';
import { ReusableTableComponent } from '../../../../shared/reusable-table/reusable-table.component';
import { TableUsersComponent } from '../../../../components/table-users/table-users.component';

@Component({
  selector: 'app-sub-profils',
  standalone: true,
  imports: [ReusableTableComponent, TableUsersComponent],
  templateUrl: './sub-profils.component.html',
  styleUrl: './sub-profils.component.scss',
})
export class SubProfilsComponent {
  // columns = ['Profils'];
  // data = [
  //   {
  //     label: 'Administrateur',
  //   },
  //   {
  //     label: 'Moderateur',
  //   },
  // ];
}
