import { Palette } from '../../models/palette/palete.model';
import { createPalette } from '../../factories/palette.factories';
import { SYSTEM_PALETTES } from '../../constants/system-palettes.constants';

export interface PaletteSlice {
  currentPalette: Palette;
  activeColorIndex: number | null;
}

export const initialPaletteSlice: PaletteSlice = {
  // currentPalette: createPalette('Project Palette'),
  currentPalette: SYSTEM_PALETTES[0],
  activeColorIndex: null,
};
