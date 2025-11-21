import { UtilisateursService } from './../../services/UtilisateursService';
import { Component, effect, signal } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { statusUtilisateur, Utilisateur } from '../../Models/Utilisateur/Utilisateurs';
import { UtilisateurCreateComponent } from '../../components/utilisateur-create/utilisateur-create.component';
import { PageableResponse } from '../../interfaces/PageableResponse';
import { UsersStore } from '../../store/users.store';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [GenericTableComponent, UtilisateurCreateComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
})
export class UtilisateursComponent {
  //signals

  utilisateursResponse$ = signal<Utilisateur[]>([]);

  //
  statusUtilisateur = statusUtilisateur;

  userCreatePopUp = false;

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
