import { ProfileStore } from './../../../../store/profile.store';
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { StatistiquesHolder } from '../../../../components/environement-documents/statistiques-holder/statistiques-holder';
import { GenericTableComponent } from '../../../../components/generic-table/generic-table.component';
import { EllipsisInterface } from '../../../../interfaces/Table-helper';
import {
  ActionFunctionType,
  ActionsDistributor,
} from '../../../../utils/ActionsDistrubitorService';
import { ActionsFunctionsInterface } from '../../../../utils/Actionsinterface';
import { AppButtons } from '../../../../interfaces/bottons';

@Component({
  selector: 'app-documents',
  imports: [CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements ActionsFunctionsInterface {
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

  bottons = AppButtons['profilePage'];

  constructor(private ActionsDistributor: ActionsDistributor, public ProfileStore: ProfileStore) {}

  actionsDistributor(event: ActionFunctionType | string) {
    this.ActionsDistributor.distributeAction(event, this);
  }

  modifierAction(): void {
    throw new Error('Method not implemented.');
  }
  supprimerAction(): void {
    throw new Error('Method not implemented.');
  }
  consulterAction(): void {
    throw new Error('Method not implemented.');
  }
  ajouterAction(): void {
    throw new Error('Method not implemented.');
  }
  exporterAction(): void {
    throw new Error('Method not implemented.');
  }
  importerAction(): void {
    throw new Error('Method not implemented.');
  }
}
