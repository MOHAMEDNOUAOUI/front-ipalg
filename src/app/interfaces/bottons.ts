import { Severity } from '../shared/p-button/p-button.component';
import { ActionFunctionType } from '../utils/ActionsDistrubitorService';
import { TableButtonsInterface } from './Table-helper';

export const AppButtons: { [key: string]: TableButtonsInterface[] } = {
  profilePage: [
    {
      title: 'Ajouter un profil',
      label: 'Ajouter un profil',
      icon: 'pi pi-plus',
      severity: Severity.Dark,
      action: ActionFunctionType.ADD,
      outline: false,
      rounded: true,
    },
    {
      title: 'Exporter profils',
      label: 'Exporter',
      icon: 'pi pi-file-excel',
      severity: Severity.Success,
      action: ActionFunctionType.EXPORT,
      outline: false,
      rounded: true,
    },
  ],
  UTILISATEURS: [
    {
      title: 'Ajouter un utilisateur',
      label: 'Ajouter un utilisateur',
      icon: 'pi pi-plus',
      severity: Severity.Dark,
      action: ActionFunctionType.ADD,
      outline: false,
      rounded: true,
    },
    {
      title: 'Exporter utilisateurs',
      label: 'Exporter',
      icon: 'pi pi-file-excel',
      severity: Severity.Success,
      action: ActionFunctionType.EXPORT,
      outline: false,
      rounded: true,
    },
  ],
};
