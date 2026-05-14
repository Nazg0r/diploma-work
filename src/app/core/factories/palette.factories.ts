import { generateId } from '../utils/id-generation.utils';
import { Palette } from '../models/palette/palete.model';

export function createPalette(name = 'Untitled'): Palette {
  return {
    id: generateId('palette'),
    name,
    colors: [],
  };
}
