export interface Vector2 {
  readonly x: number;
  readonly y: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface CanvasInputHandlerOptions {
  onZoom: (focusPoint: Vector2, factor: number) => void;
  onPan: (delta: Vector2) => void;
}
