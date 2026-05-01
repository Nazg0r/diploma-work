import { InjectionToken } from '@angular/core';
import { Layer } from '../../models/layers';
import { LayerStore } from './layer.store';

export const LAYER_STORE = new InjectionToken<LayerStore<Layer>>('LAYER_STORE');
