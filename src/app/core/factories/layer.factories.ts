import { Size } from '../models/canvas.model';
import { LayerCollection, ObjectLayer, PixelLayer, TileLayer } from '../models/layers';
import { generateId } from '../utils/id-generation.utils';

const DEFAULT_LAYERS_PROPS = {
  isVisible: true,
  isLocked: false,
  opacity: 1,
  blendMode: 'normal',
};

export function createPixelLayer(
  name: string,
  size: Size,
  parentId: string | null = null,
): PixelLayer {
  return {
    id: generateId('layer'),
    kind: 'pixel',
    name,
    size,
    parentId,
    data: new ImageData(size.width, size.height),
    ...DEFAULT_LAYERS_PROPS,
  } as PixelLayer;
}

export function createTileLayer(
  name: string,
  size: Size,
  tileSize: number,
  parentId: string | null = null,
): TileLayer {
  return {
    id: generateId('layer'),
    kind: 'tile',
    name,
    size,
    tileSize,
    parentId,
    tiles: new Map(),
    ...DEFAULT_LAYERS_PROPS,
  } as TileLayer;
}

export function createObjectLayer(name: string, parentId: string | null = null): ObjectLayer {
  return {
    id: generateId('layer'),
    kind: 'object',
    name,
    parentId,
    objects: [],
    ...DEFAULT_LAYERS_PROPS,
  } as ObjectLayer;
}

export function createLayerCollection(
  name: string,
  parentId: string | null = null,
): LayerCollection {
  return {
    id: generateId('collection'),
    name,
    parentId,
    isCollapsed: false,
    children: [],
  };
}
