import { CommonModule } from '@angular/common';
import { Alerts } from '../../interfaces/AlertsFront';
import { AlertFrontStore } from './../../store/front-alerts.store';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  alertStore = inject(AlertFrontStore);

  // Listen to the alerts array
  alerts = this.alertStore.alerts;

  constructor() {}
  ngOnInit() {
    // console.log('test');
  }

  removeAlert(identifier: string | number) {
    if (typeof identifier === 'string') {
      this.alertStore.removeAlertById(identifier);
    } else {
      this.alertStore.removeAlert(identifier);
    }
  }
  // You can initialize or fetch alerts here if needed
}
