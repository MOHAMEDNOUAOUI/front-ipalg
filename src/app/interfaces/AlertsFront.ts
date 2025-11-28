export enum AlertType {
  Primary = 'primary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  Info = 'info',
}

export interface Alerts {
  message: string | HTMLElement;
  type: AlertType;
  outlined?: boolean;
  duration?: number;
  id?: string;
  icon?: string;
  progress?: number;
  secondsRemaining?: number;
  state?: 'entering' | 'visible' | 'exiting';
}
