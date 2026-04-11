import { Size } from '../../../core/models/canvas.model';
import { GridConfig } from '../engine/grid';
import { DEFAULT_GRID_CONFIG } from '../constants/grid-constants';
import { DEFAULT_CANVAS_SIZE } from '../constants/canvas-constants';
import { DEFAULT_VIEWPORT_CONFIG } from '../constants/viewport-constants';

export interface CanvasSlice {
  readonly canvasSize: Size;
  readonly gridConfig: GridConfig;
  readonly zoom: number;
}

export const initialCanvasSlice: CanvasSlice = {
  canvasSize: DEFAULT_CANVAS_SIZE,
  gridConfig: DEFAULT_GRID_CONFIG,
  zoom: DEFAULT_VIEWPORT_CONFIG.zoom,
};
