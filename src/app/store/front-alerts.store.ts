import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { computed, Injectable } from '@angular/core';
import { Alerts, AlertType } from '../interfaces/AlertsFront';
import { of } from 'rxjs';

interface AlertsFrontState {
  alerts: Alerts[];
}

const initialeState: AlertsFrontState = {
  alerts: [],
};

@Injectable({
  providedIn: 'root',
})
export class AlertFrontStore extends signalStore(
  withState(initialeState),
  withMethods((store) => ({
    addAlert(alert: Alerts, maxAlerts = 3) {
      if (store.alerts().length >= maxAlerts) {
        this.removeFirstAlertWithAnimation();
      }
      const alertWithId: Alerts = {
        ...alert,
        id: alert.id || this.generateId(),
        progress: 100,
        secondsRemaining: Math.ceil((alert.duration || 0) / 1000),
        state: 'entering' as const,
      };

      patchState(store, (state) => ({
        alerts: [...state.alerts, alertWithId],
      }));

      // Change to visible after entering animation
      setTimeout(() => {
        patchState(store, (state) => ({
          alerts: state.alerts.map((a) =>
            a.id === alertWithId.id ? { ...a, state: 'visible' as const } : a
          ),
        }));
      }, 100);

      if (alert.duration && alert.duration > 0) {
        this.startCountdownTimer(alertWithId);
      }
    },

    removeFirstAlertWithAnimation() {
      if (store.alerts().length > 0) {
        const firstAlert = store.alerts()[0];

        // Set first alert to exiting state
        patchState(store, (state) => ({
          alerts: state.alerts.map((alert, index) =>
            index === 0 ? { ...alert, state: 'exiting' as const } : alert
          ),
        }));

        // Remove after animation completes
        setTimeout(() => {
          patchState(store, (state) => ({
            alerts: state.alerts.slice(1),
          }));
        }, 300); // Match CSS animation duration
      }
    },

    removeFirstAlert() {
      this.removeFirstAlertWithAnimation();
    },

    removeLastAlert() {
      if (store.alerts().length > 0) {
        this.removeAlert(store.alerts().length - 1);
      }
    },

    clearAlerts() {
      // Animate all alerts out then clear
      patchState(store, (state) => ({
        alerts: state.alerts.map((alert) => ({
          ...alert,
          state: 'exiting' as const,
        })),
      }));

      setTimeout(() => {
        patchState(store, { alerts: [] });
      }, 300);
    },

    removeAlert(index: number) {
      const alert = store.alerts()[index];
      if (alert) {
        // Set to exiting state
        patchState(store, (state) => ({
          alerts: state.alerts.map((a, i) =>
            i === index ? { ...a, state: 'exiting' as const } : a
          ),
        }));

        // Remove after animation duration
        setTimeout(() => {
          patchState(store, (state) => ({
            alerts: state.alerts.filter((_, i) => i !== index),
          }));
        }, 300);
      }
    },

    removeAlertById(id: string) {
      const alert = store.alerts().find((a) => a.id === id);
      if (alert) {
        // Set to exiting state
        patchState(store, (state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, state: 'exiting' as const } : a)),
        }));

        // Remove after animation duration
        setTimeout(() => {
          patchState(store, (state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== id),
          }));
        }, 300);
      }
    },

    generateId(): string {
      return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    startCountdownTimer(alert: Alerts) {
      const startTime = Date.now();
      const updateInterval = 1000;
      const smoothInterval = 50;

      const smoothTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, (alert.duration || 0) - elapsed);
        const progress = (remaining / (alert.duration || 0)) * 100;

        patchState(store, (state) => ({
          alerts: state.alerts.map((a) => (a.id === alert.id ? { ...a, progress } : a)),
        }));

        if (remaining <= 0) {
          clearInterval(smoothTimer);
          clearInterval(secondsTimer);
          this.removeAlertById(alert.id!);
        }
      }, smoothInterval);

      const secondsTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingMs = Math.max(0, (alert.duration || 0) - elapsed);
        const secondsRemaining = Math.ceil(remainingMs / 1000);

        patchState(store, (state) => ({
          alerts: state.alerts.map((a) => (a.id === alert.id ? { ...a, secondsRemaining } : a)),
        }));
      }, updateInterval);
    },
  }))
) {
  readonly hasAlerts = computed(() => this.alerts().length > 0);
  readonly alertCount = computed(() => this.alerts().length);
  constructor() {
    super();
  }

  success(message: string, duration: number = 5000, icon?: string) {
    this.addAlert({ message, duration, icon: 'pi-check-circle', type: AlertType.Success });
  }

  error(message: string, duration: number = 5000, icon?: string) {
    this.addAlert({ message, duration, icon: 'pi-exclamation-triangle', type: AlertType.Danger });
  }

  warning(message: string, duration: number = 5000, icon?: string) {
    this.addAlert({ message, duration, icon: 'pi-exclamation-circle', type: AlertType.Warning });
  }

  info(message: string, duration: number = 5000, icon?: string) {
    this.addAlert({ message, duration, icon: 'pi-question', type: AlertType.Info });
  }
}
