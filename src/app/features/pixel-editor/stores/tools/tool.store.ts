import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ToolId } from '../../../../core/models/tools/tool-context.model';
import { initialToolSlice } from './tool.slice';
import { MAX_BRUSH_SIZE } from '../../../../core/constants/tools.constants';

export const ToolStore = signalStore(
  { providedIn: 'root' },
  withState(initialToolSlice),
  withMethods((store) => ({
    setActiveTool: (id: ToolId) => patchState(store, { activeTool: id }),
    setBrushSize: (size: number) =>
      patchState(store, {
        brushSize: Math.max(1, Math.min(MAX_BRUSH_SIZE, size)),
      }),
    setColor: (color: string) => patchState(store, { color }),
    setPerfectPixel: (enabled: boolean) => patchState(store, { perfectPixel: enabled }),
    setOpacity: (opacity: number) =>
      patchState(store, { opacity: Math.max(0, Math.min(1, opacity)) }),
  })),
);
