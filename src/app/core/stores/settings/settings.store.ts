import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { HotkeyAction } from '../../constants/hotkey-actions.constants';
import { KeyCombo } from '../../models/hotkeys';
import { initialSettings } from './settings.slice';
import { resetHotkey, resetHotkeys, setHotkey, setMaxHistorySize } from './settings.updaters';

export const SettingsStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialSettings),
  withComputed((store) => {
    return {};
  }),
  withMethods((store) => {
    return {
      setMaxHistorySize: (maxHistorySize: number) =>
        patchState(store, setMaxHistorySize(maxHistorySize)),
      setHotkey: (action: HotkeyAction, combos: KeyCombo[]) =>
        patchState(store, setHotkey(action, combos)),
      resetHotkey: (action: HotkeyAction) => patchState(store, resetHotkey(action)),
      resetHotkeys: () => patchState(store, resetHotkeys()),
    };
  }),
);
