import { Layer, LayerCollection, LayerCounters, LayerKind, NodeRef } from '../../models/layers';

export interface LayerSlice<T extends Layer = Layer> {
  layers: Record<string, T>;
  collections: Record<string, LayerCollection>;
  activeLayerId: string | null;
  rootChildren: NodeRef[];
  counters: LayerCounters;
}

export function createInitialLayerSlice<T extends Layer>(): LayerSlice<T> {
  return {
    layers: {},
    collections: {},
    activeLayerId: null,
    rootChildren: [],
    counters: {
      collection: 0,
      object: 0,
      pixel: 0,
      tile: 0,
    }
  };
}
