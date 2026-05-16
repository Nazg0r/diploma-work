import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialColorSlice } from './color.slice';

export const ColorStore = signalStore(
  { providedIn: 'root' },
  withState(initialColorSlice),
  withMethods((store) => ({
    setForeground(color: string): void {
      patchState(store, { foreground: color });
    },

    setBackground(color: string): void {
      patchState(store, { background: color });
    },

    swap(): void {
      patchState(store, (s) => ({
        foreground: s.background,
        background: s.foreground,
      }));
    },
  })),
);
