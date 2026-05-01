import { LayerItemKind } from '../models/layers';

export const NODE_ITEM_OFFSET = 16;
export const LAYER_ITEM_OFFSET = 8;
export const COLLECTION_ITEM_OFFSET = 12;

export const NAME_FORMATTERS: Record<LayerItemKind, (order: number) => string> = {
  collection: (order) => `Collection ${order}`,
  pixel: (order) => `Layer ${order}`,
  tile: (order) => `Tile Layer ${order}`,
  object: (order) => `Object Layer ${order}`,
};
