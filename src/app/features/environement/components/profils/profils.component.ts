import { ActionsDistributor } from './../../../../utils/ActionsDistrubitorService';
import { ProfileService } from './../../../../services/Profiles/profile-service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { ProfileStore } from '../../../../store/profile.store';
import { EllipsisInterface } from '../../../../interfaces/Table-helper';
import { GenericTableComponent } from '../../../../components/generic-table/generic-table.component';
import { AppButtons } from '../../../../interfaces/bottons';
import { ActionsFunctionsInterface } from '../../../../utils/Actionsinterface';
import { ActionFunctionType } from '../../../../utils/ActionsDistrubitorService';
import { GenericTableFooter } from '../../../../components/generic-table-footer/generic-table-footer';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GenericTableComponent,
    PaginationComponent,
    GenericTableFooter,
  ],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.scss',
})
export class ProfilsComponent implements ActionsFunctionsInterface {
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

  constructor(
    public profileStore: ProfileStore,
    private ProfileService: ProfileService,
    private ActionsDistributor: ActionsDistributor
  ) {}

  ngOnInit() {
    console.log('data', this.profileStore.selectedData());
  }

  actionsDistributor(event: ActionFunctionType | string) {
    this.ActionsDistributor.distributeAction(event, this);
  }

  ///////// functions actions
  modifierAction(): void {
    throw new Error('Method not implemented.');
  }
  supprimerAction(): void {
    throw new Error('Method not implemented.');
  }
  consulterAction(): void {
    alert('consulterAction');
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
  ///////// end functions actions
}
