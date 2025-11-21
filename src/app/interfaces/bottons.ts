import { Severity } from '../shared/p-button/p-button.component';
import { TableButtonsInterface } from './Table-helper';

export const AppButtons: { [key: string]: TableButtonsInterface[] } = {
  profilePage: [
    {
      title: 'Ajouter un profil',
      label: 'Ajouter un profil',
      icon: 'pi pi-plus',
      severity: Severity.Dark,
      action: 'ADD',
      outline: false,
      rounded: true,
    },
    {
      title: 'Exporter profils',
      label: 'Exporter',
      icon: 'pi pi-file-excel',
      severity: Severity.Success,
      action: 'EXPORTER',
      outline: false,
      rounded: true,
    },
  ],
};
