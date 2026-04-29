import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialSettings } from './settings.slice';
import { setMaxHistorySize } from './settings.updaters';

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
    };
  }),
);
