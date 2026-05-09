import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { bootstrapHotkeys } from './core/bootstraps/hotkey-bindings.bootstrap';
import { PanelLayoutService } from './core/services/panel-layout.service';
import { bootstrapMenuItems } from './core/bootstraps/menu-item-bindings.bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(bootstrapHotkeys),
    provideAppInitializer(bootstrapMenuItems),
    provideAppInitializer(() => {
      inject(PanelLayoutService);
    }),
  ],
};
