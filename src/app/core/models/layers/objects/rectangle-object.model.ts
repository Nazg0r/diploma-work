import { BaseLayerObject } from './layer-object.model';
import { Size } from '../../canvas.model';

export interface RectangleObject extends BaseLayerObject {
  shape: 'rectangle';
  size: Size;
}
