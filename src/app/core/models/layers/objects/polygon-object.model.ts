import { Vector2 } from '../../canvas.model';
import { BaseLayerObject } from './layer-object.model';

export interface PolygonObject extends BaseLayerObject {
  shape: 'polygon';
  points: Vector2[];
}
