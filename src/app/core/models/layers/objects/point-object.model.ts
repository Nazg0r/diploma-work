import { BaseLayerObject } from './layer-object.model';

export interface PointObject extends BaseLayerObject {
  shape: 'point';
}
