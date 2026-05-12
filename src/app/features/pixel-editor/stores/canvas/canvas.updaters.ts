import { PartialStateUpdater } from '@ngrx/signals';
import { Size } from '../../../core/models/canvas.model';
import { GridConfig } from '../engine/grid';
import { CanvasSlice } from './canvas.slice';

export function changeCanvasSize(size: Size): PartialStateUpdater<CanvasSlice> {
  return (_) => ({ canvasSize: size });
}

export function setGridConfig(conf: Partial<GridConfig>): PartialStateUpdater<CanvasSlice> {
  return (store) => ({ gridConfig: { ...store.gridConfig, ...conf } });
}

export function syncZoom(zoom: number): PartialStateUpdater<CanvasSlice> {
  return (_) => ({ zoom });
}
