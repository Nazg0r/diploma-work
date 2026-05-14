import { generateId } from '../../utils/id-generation.utils';

export interface Palette {
  readonly id: string;
  name: string;
  colors: string[];
  readonly isSystem?: boolean;
}

export function createPalette(name = 'Untitled'): Palette {
  return {
    id: generateId('palette'),
    name,
    colors: [],
  };
}
