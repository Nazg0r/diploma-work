import { RGBA } from './palette/color.model';

export interface PixelChange {
  x: number;
  y: number;
  oldColor: RGBA;
  newColor: RGBA;
}
