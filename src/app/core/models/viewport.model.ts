import { Vector2 } from './canvas.model';

export interface Viewport {
  readonly offset: Vector2;
  readonly zoom: number;
}
