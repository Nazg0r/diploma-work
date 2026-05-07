import { inject } from '@angular/core';
import { HistoryManagerService } from '../services/history-manager.service';
import { HotkeyService } from '../services/hotkey.service';

export function bootstrapHotkeys(): void {
  const hotkeys = inject(HotkeyService);
  const history = inject(HistoryManagerService);

  hotkeys.register('undo', () => history.undo());
  hotkeys.register('redo', () => history.redo());
}
