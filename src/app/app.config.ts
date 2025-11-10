import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import {
  tablerSettingsCode,
  tablerProgressHelp,
  tablerUsers,
  tablerSmartHome,
  tablerHomeSignal,
  tablerBrandGoogleHome,
  tablerTruckDelivery,
} from '@ng-icons/tabler-icons';
import {
  tablerShieldHalfFill,
  tablerHomeFill,
  tablerBellRingingFill,
  tablerLayoutDashboardFill,
  tablerArchiveFill,
  tablerCloverFill,
} from '@ng-icons/tabler-icons/fill';
import { iconoirArrowSeparateVertical } from '@ng-icons/iconoir';
import { ionLogOut, ionLogOutOutline, ionHome, ionShieldHalf, ionMan } from '@ng-icons/ionicons';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { matNotificationsActive, matNotifications } from '@ng-icons/material-icons/baseline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideIcons({
      tablerSettingsCode,
      tablerProgressHelp,
      iconoirArrowSeparateVertical,
      ionLogOut,
      ionLogOutOutline,
      matNotificationsActive,
      matNotifications,
      ionHome,
      ionShieldHalf,
      ionMan,
      tablerUsers,
      tablerSmartHome,
      tablerHomeSignal,
      tablerBrandGoogleHome,
      tablerShieldHalfFill,
      tablerHomeFill,
      tablerBellRingingFill,
      tablerLayoutDashboardFill,
      tablerArchiveFill,
      tablerCloverFill,
      tablerTruckDelivery,
    }),
  ],
};
