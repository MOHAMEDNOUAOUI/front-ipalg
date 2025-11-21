import { Severity } from '../shared/p-button/p-button.component';

export interface EllipsisInterface {
  label: string;
  icon: string;
  action: string;
  class: string;
}

export interface TableButtonsInterface {
  title: string;
  label: string;
  icon: string;
  severity: Severity;
  action: string;
  outline: boolean;
  rounded: boolean;
}
