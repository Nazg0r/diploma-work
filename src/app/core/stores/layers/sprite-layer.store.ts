import { inject } from '@angular/core';
import { signalStore, withHooks, withState } from '@ngrx/signals';
import { CanvasStore } from '../../../features/pixel-editor/stores/canvas/canvas.store';
import { createPixelLayer } from '../../factories/layer.factories';
import { PixelLayer } from '../../models/layers';
import { withLayerComputed } from './layer-computed.feature';
import { withLayerMethods } from './layer-methods.feature';
import { createInitialLayerSlice } from './layer.slice';

export const SpriteLayerStore = signalStore(
  withState(createInitialLayerSlice<PixelLayer>()),
  withLayerComputed(),
  withLayerMethods(),
  withHooks({
    onInit: (store) => {
      const canvasStore = inject(CanvasStore);
      const firstLayerName = store.getLayerItemName('pixel');
      const layer = createPixelLayer(firstLayerName, canvasStore.canvasSize());
      store.addLayer(layer);
    },
  }),
);
