import { signalStore, withState } from '@ngrx/signals';
import { LevelLayer } from '../../models/layers';
import { withLayerComputed } from './layer-computed.feature';
import { withLayerMethods } from './layer-methods.feature';
import { createInitialLayerSlice } from './layer.slice';

export const LevelLayerStore = signalStore(
  withState(createInitialLayerSlice<LevelLayer>()),
  withLayerComputed(),
  withLayerMethods(),
);
