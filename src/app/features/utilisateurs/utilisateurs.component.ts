import { UtilisateursService } from './../../services/UtilisateursService';
import { Component, effect, signal } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { TableUsersComponent } from '../../components/table-users/table-users.component';
import { statusUtilisateur, Utilisateur } from '../../Models/Utilisateur/Utilisateurs';
import { UtilisateurCreateComponent } from '../../components/utilisateur-create/utilisateur-create.component';
import { PageableResponse } from '../../interfaces/PageableResponse';
import { UsersStore } from '../../store/users.store';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [ReusableTableComponent, TableUsersComponent, UtilisateurCreateComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
})
export class UtilisateursComponent {
  //signals

  utilisateursResponse$ = signal<Utilisateur[]>([]);

  //
  statusUtilisateur = statusUtilisateur;

  userCreatePopUp = false;

  columns = [
    // {
    //   label: 'Something Else',
    //   value: [
    //     {
    //       value: 'status',
    //     },
    //     {
    //       value: 'createdBy',
    //     },
    //   ],
    // },
    {
      label: 'Utilisateur',
      value: [
        {
          value: 'username',
          bold: true,
        },
        {
          value: 'email',
        },
      ],
    },
    {
      label: "Nom d'utilisateur",
      value: 'userProfile',
      item: 'name',
      active: true,
    },
    {
      label: 'Prenom',
      value: 'firstName',
      active: true,
      // item: 'label',
    },
    {
      label: 'Nom',
      value: 'lastName',
      active: true,
      // item: 'label',
    },
    {
      label: 'Permissions',
      value: 'permissionsCount',
      active: false,
    },
    {
      label: 'Status',
      value: 'status',
      active: true,
    },

    {
      label: 'Date de Creation',
      value: 'dateCreation',
      type: 'DATE',
      active: true,
    },
    {
      label: 'Dernière modification',
      value: 'dateUpdate',
      type: 'DATE',
      active: true,
    },
    {
      label: 'latest login',
      value: 'lastLogin',
      type: 'DATE',
      active: true,
    },

    {
      label: 'Créé par',
      value: 'createdBy',
      active: false,
    },
  ];
  // data: Utilisateur[] = [
  //   {
  //     id: '1',
  //     username: 'Khalid Tissmi',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Active,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '2',
  //     username: 'Mohamed Do',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Active,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '3',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Active,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '4',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Pending,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '5',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Active,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '6',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Inactive,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '7',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Inactive,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '8',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Locked,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '9',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Pending,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  //   {
  //     id: '10',
  //     username: 'Jhon from there',
  //     email: 'email@gmail.com',
  //     status: statusUtilisateur.Locked,
  //     profile: {
  //       id: '1',
  //       label: 'Administrateur',
  //     },
  //     createdBy: 'Administrateur',
  //     dateDeModification: new Date(),
  //   },
  // ];

  //

  data = [];
  constructor(public userStore: UsersStore, private service: UtilisateursService) {}

  ngOnInit() {}

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

  exporterUtilisateurs() {
    this.service.exportUtilisateurs(this.userStore.filter()).subscribe({
      next: (rsp: Blob) => {
        const url = window.URL.createObjectURL(rsp);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
