import { inject } from '@angular/core';
import { HistoryManagerService } from '../services/history-manager.service';
import { MenuStore } from '../stores/menu/menu.store';

export function bootstrapMenuItems() {
  const menu = inject(MenuStore);
  const history = inject(HistoryManagerService);

  menu.registerAction('edit/undo', () => history.undo());
  menu.registerAction('edit/redo', () => history.redo());
}
