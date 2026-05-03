import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SettingsStore } from '../settings/settings.store';
import { initialHistory } from './history.slice';
import * as updaters from './history.updaters';
import { Command } from '../../models/commands/command.model';

export const HistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialHistory),
  withComputed((store) => {
    return {
      canUndo: computed(() => store.past().length > 0),
      canRedo: computed(() => store.future().length > 0),
    };
  }),
  withMethods((store, settings = inject(SettingsStore)) => {
    return {
      execute: (command: Command) =>
        patchState(store, updaters.execute(command, settings.maxHistorySize())),
      undo: () => patchState(store, updaters.undo()),
      redo: () => patchState(store, updaters.redo()),
      clear: () => patchState(store, updaters.clear()),
      undoTo: (index: number) => patchState(store, updaters.undoTo(index)),
    };
  }),
);
