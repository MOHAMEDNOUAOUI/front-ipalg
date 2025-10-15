import { Component } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { TableUsersComponent } from '../../components/table-users/table-users.component';
import {
  statusUtilisateur,
  Utilisateur,
} from '../../Models/Utilisateur/Utilisateurs';
import { UtilisateurCreateComponent } from "../../components/utilisateur-create/utilisateur-create.component";

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [ReusableTableComponent, TableUsersComponent, UtilisateurCreateComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
})
export class UtilisateursComponent {
  totalPages: number = 10;
  currentPage: number = 0;
  size = 10;
  totalElements = 10;
  statusUtilisateur = statusUtilisateur;

  userCreatePopUp = false;

  columns = [
    {
      label: 'Utilisateur',
      value: [
        {
          value: 'username',
        },
        {
          value: 'profile',
          item: 'label',
        },
      ],
      bold: true,
    },
    {
      label: 'Profile',
      value: 'profile',
      item: 'label',
    },
    {
      label: 'Status',
      value: 'status',
    },
    {
      label: 'Créé par',
      value: 'createdBy',
    },
    {
      label: 'Dernière modification',
      value: 'dateDeModification',
    },
  ];
  data: Utilisateur[] = [
    {
      id: '1',
      username: 'Khalid Tissmi',
      email: 'email@gmail.com',
      status: statusUtilisateur.Active,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '2',
      username: 'Mohamed Do',
      email: 'email@gmail.com',
      status: statusUtilisateur.Active,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '3',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Active,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '4',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Active,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '5',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Active,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '6',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Inactive,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '7',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Inactive,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: '8',
      username: 'Jhon from there',
      email: 'email@gmail.com',
      status: statusUtilisateur.Locked,
      profile: {
        id: '1',
        label: 'Admin',
      },
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    // {
    //   id: '9',
    //   username: 'Jhon from there',
    //   email: 'email@gmail.com',
    //   status: statusUtilisateur.Pending,
    //   profile: {
    //     id: '1',
    //     label: 'Admin',
    //   },
    //   createdBy: 'Admin',
    //   dateDeModification: new Date(),
    // },
    // {
    //   id: '10',
    //   username: 'Jhon from there',
    //   email: 'email@gmail.com',
    //   status: statusUtilisateur.Locked,
    //   profile: {
    //     id: '1',
    //     label: 'Admin',
    //   },
    //   createdBy: 'Admin',
    //   dateDeModification: new Date(),
    // },
  ];

  // outputs emits

  takeFilterResponse($event: boolean) {
    if ($event) {
      alert('filtering');
    }
  }
  takeDeleteResponse($event: { confirmed: boolean; user: Utilisateur }) {
    if ($event.confirmed) {
      console.log($event.user);
    }
  }
  takeAjouterResponse($event: boolean) {
    if ($event) {
      this.userCreatePopUp = true;
    }
  }
  takeModifierResponse($event: { confirmed: boolean; user: Utilisateur }) {
    if ($event.confirmed) {
      console.log($event.user);
    }
  }
}
