import { PixelLayer, TileLayer, ObjectLayer } from './index';

export type Layer = PixelLayer | TileLayer | ObjectLayer;

export type LevelLayer = ObjectLayer | TileLayer;

export function isPixelLayer(layer: Layer): layer is PixelLayer {
  return layer.kind === 'pixel';
}
export function isTileLayer(layer: Layer): layer is TileLayer {
  return layer.kind === 'tile';
}
export function isObjectLayer(layer: Layer): layer is ObjectLayer {
  return layer.kind === 'object';
}
