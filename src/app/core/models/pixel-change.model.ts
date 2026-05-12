export type RGBA = [number, number, number, number];

export interface PixelChange {
  x: number;
  y: number;
  oldColor: RGBA;
  newColor: RGBA;
}
