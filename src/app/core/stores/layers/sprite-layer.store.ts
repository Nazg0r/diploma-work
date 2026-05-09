import { signalStore, withState } from '@ngrx/signals';
import { PixelLayer } from '../../models/layers';
import { withLayerComputed } from './layer-computed.feature';
import { withLayerMethods } from './layer-methods.feature';
import { createInitialLayerSlice } from './layer.slice';

export const SpriteLayerStore = signalStore(
  withState(createInitialLayerSlice<PixelLayer>()),
  withLayerComputed(),
  withLayerMethods(),
);
