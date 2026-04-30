import { BaseLayer } from './base-layer.model';
import { Size } from '../../canvas.model';

export interface PixelLayer extends BaseLayer {
  readonly kind: 'pixel';
  data: ImageData;
  size: Size;
}
