import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SYSTEM_PALETTES } from '../../constants/system-palettes.constants';
import { Palette } from '../../models/palette/palete.model';
import { initialPaletteSlice } from './palette.slice';
import * as updaters from './palette.updaters';

export const PaletteStore = signalStore(
  { providedIn: 'root' },
  withState(initialPaletteSlice),

  withComputed((store) => ({
    systemPalettes: computed(() => SYSTEM_PALETTES),

    activeColor: computed(() => {
      const idx = store.activeColorIndex();
      if (idx === null) return null;
      return store.currentPalette().colors[idx] ?? null;
    }),
  })),

  withMethods((store) => ({
    addColor: (color: string) => patchState(store, updaters.addColor(color)),

    updateColor: (index: number, color: string) =>
      patchState(store, updaters.updateColor(index, color)),

    removeColor: (index: number) => patchState(store, updaters.removeColor(index)),

    setActiveColorIndex(index: number | null): void {
      patchState(store, { activeColorIndex: index });
    },

    setPalette(palette: Palette): void {
      patchState(store, {
        currentPalette: palette,
        activeColorIndex: null,
      });
    },

    loadSystemPalette: (id: string) => patchState(store, updaters.loadSystemPalette(id)),
  })),
);
