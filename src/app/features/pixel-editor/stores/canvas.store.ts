import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialCanvasSlice } from './canvas.slice';
import { Size } from '../../../core/models/canvas.model';
import { changeCanvasSize, setGridConfig, syncZoom } from './canvas.updaters';
import { GridConfig } from '../engine/grid';

export const CanvasStore = signalStore(
  {providedIn: 'root'},
  withState(initialCanvasSlice),
  withMethods(store => {
    return {
      changeCanvasSize: (size: Size) => patchState(store, changeCanvasSize(size)),
      setGridConfig: (conf: Partial<GridConfig>) => patchState(store, setGridConfig(conf)),
      syncZoom: (zoom: number) => patchState(store, syncZoom(zoom)),
    }
  })
)
