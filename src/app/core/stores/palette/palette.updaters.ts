import { PartialStateUpdater } from '@ngrx/signals';
import { SYSTEM_PALETTES } from '../../constants/system-palettes.constants';
import { createPalette } from '../../factories/palette.factories';
import { PaletteSlice } from './palette.slice';

export function addColor(color: string): PartialStateUpdater<PaletteSlice> {
  return (store) => ({
    currentPalette: { ...store.currentPalette, color: [...store.currentPalette.colors, color] },
  });
}

export function updateColor(index: number, color: string): PartialStateUpdater<PaletteSlice> {
  return (store) => ({
    currentPalette: {
      ...store.currentPalette,
      colors: store.currentPalette.colors.map((c, i) => (i === index ? color : c)),
    },
  });
}

export function removeColor(index: number): PartialStateUpdater<PaletteSlice> {
  return (store) => ({
    currentPalette: {
      ...store.currentPalette,
      colors: store.currentPalette.colors.filter((_, i) => i !== index),
    },
    activeColorIndex: store.activeColorIndex === index ? null : store.activeColorIndex,
  });
}

export function loadSystemPalette(id: string): PartialStateUpdater<PaletteSlice> {
  return (store) => {
    const sys = SYSTEM_PALETTES.find((p) => p.id === id);
    if (!sys) return store;
    return {
      currentPalette: {
        ...createPalette(sys.name),
        colors: [...sys.colors],
      },
      activeColorIndex: null,
    };
  };
}
