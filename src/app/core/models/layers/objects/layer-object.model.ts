import { Vector2 } from '../../canvas.model';

export type LayerObjectShape = 'rectangle' | 'point' | 'polygon';
export type PropertyType = string | number | boolean;

export interface BaseLayerObject {
  readonly id: string;
  name: string;
  position: Vector2;
  shape: LayerObjectShape;
  properties: Record<string, PropertyType>;
}
