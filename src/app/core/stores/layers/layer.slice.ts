import { Layer, LayerCollection, NodeRef } from '../../models/layers';

export interface LayerSlice<T extends Layer = Layer> {
  layers: Record<string, T>;
  collections: Record<string, LayerCollection>;
  activeLayerId: string | null;
  rootChildren: NodeRef[];
}

export function createInitialLayerSlice<T extends Layer>(): LayerSlice<T> {
  return {
    layers: {},
    collections: {},
    activeLayerId: null,
    rootChildren: [],
  };
}
