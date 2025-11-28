import { AlertFrontStore } from './../../store/front-alerts.store';
import { UtilisateursService } from './../../services/UtilisateursService';
import { Component, effect, signal } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { statusUtilisateur, Utilisateur } from '../../Models/Utilisateur/Utilisateurs';
import { UtilisateurCreateComponent } from '../../components/utilisateur-create/utilisateur-create.component';
import { PageableResponse } from '../../interfaces/PageableResponse';
import { UsersStore } from '../../store/users.store';
import { saveAs } from 'file-saver';
import { AppButtons } from '../../interfaces/bottons';
import { ActionFunctionType, ActionsDistributor } from '../../utils/ActionsDistrubitorService';
import { EllipsisInterface } from '../../interfaces/Table-helper';
import { ActionsFunctionsInterface } from '../../utils/Actionsinterface';
import { ConfirmationPopUp } from '../../components/confirmation-pop-up/confirmation-pop-up';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [GenericTableComponent, UtilisateurCreateComponent, ConfirmationPopUp],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
})
export class UtilisateursComponent implements ActionsFunctionsInterface {
  buttons = AppButtons['UTILISATEURS'];
  items: EllipsisInterface[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      action: ActionFunctionType.MODIFY,
      class: 'button-modifier',
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      action: ActionFunctionType.DELETE,
      class: 'button-supprimer',
    },
    {
      label: 'Consulter',
      icon: 'pi pi-eye',
      action: ActionFunctionType.VIEW,
      class: 'button-consulter',
    },
  ];
  //signals

  utilisateursResponse$ = signal<Utilisateur[]>([]);

  //
  statusUtilisateur = statusUtilisateur;

  userCreatePopUp = false;

  constructor(
    public userStore: UsersStore,
    private service: UtilisateursService,
    private ActionsDistributor: ActionsDistributor,
    private AlertFrontStore: AlertFrontStore
  ) {}

  ngOnInit() {}

  actionsDistributor(event: ActionFunctionType | string) {
    console.log(event);

    this.ActionsDistributor.distributeAction(event, this);
  }

  modifierAction(): void {
    throw new Error('Method not implemented.');
  }
  supprimerAction(): void {
    this.AlertFrontStore.success('Utilisateur supprimer aves succes', 1500);
  }
  consulterAction(): void {
    throw new Error('Method not implemented.');
  }
  ajouterAction(): void {
    this.userCreatePopUp = true;
  }
  exporterAction(): void {
    this.AlertFrontStore.success('Fichier exporter aves succes', 1500);
  }
  importerAction(): void {
    throw new Error('Method not implemented.');
  }
}
