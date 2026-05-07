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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(bootstrapHotkeys),
    provideAppInitializer(() => {
      inject(PanelLayoutService);
    }),
  ],
};
