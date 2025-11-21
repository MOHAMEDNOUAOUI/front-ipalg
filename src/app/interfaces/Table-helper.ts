export interface EllipsisInterface {
  label: string;
  icon: string;
  action?: string;
  class?: string;
  command: () => void;
}

export interface TableButtonsInterface {
  label: string;
  icon: string;
  severity: string;
  outline: boolean;
  rounded: boolean;
  command: () => void;
}
