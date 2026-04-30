import { Viewport } from '../viewport.model';
import { Layer } from './layer.model';

export interface LayersRenderer<T extends Layer = Layer> {
  render(ctx: CanvasRenderingContext2D, layer: T[], viewport: Viewport): void;
}
