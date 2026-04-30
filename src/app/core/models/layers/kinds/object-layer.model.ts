import { BaseLayer } from './base-layer.model';
import { RectangleObject } from '../objects/rectangle-object.model';
import { PointObject } from '../objects/point-object.model';
import { PolygonObject } from '../objects/polygon-object.model';

export type LayerObject = RectangleObject | PointObject | PolygonObject;

export interface ObjectLayer extends BaseLayer {
  readonly kind: 'object';
  objects: LayerObject[];
}
