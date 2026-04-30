import { BaseLayer } from './base-layer.model';
import { Size, Vector2 } from '../../canvas.model';

export interface TileReference {
  tilesetId: string;
  position: Vector2;
  flipX?: boolean;
  flipY?: boolean;
  rotation?: 0 | 90 | 180 | 270;
}

export interface TileLayer extends BaseLayer {
  readonly kind: 'tile';
  size: Size;
  tileSize: number;
  tiles: Map<Vector2, TileReference>;
}
