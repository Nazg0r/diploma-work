import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { NAME_FORMATTERS } from '../../constants/layers.constants';
import { BlendMode, Layer, LayerCollection, LayerItemKind, NodeRef } from '../../models/layers';
import { LayerSlice } from './layer.slice';
import * as updaters from './layer.updaters';

export function withLayerMethods() {
  return signalStoreFeature(
    { state: type<LayerSlice>() },

    withMethods((store) => ({
      addLayer: (layer: Layer) => patchState(store, updaters.addLayer(layer)),

      removeLayer: (id: string) => patchState(store, updaters.removeLayer(id)),

      setActiveLayer: (id: string | null) => patchState(store, updaters.setActiveLayer(id)),

      setLayerProperties: (id: string, properties: Partial<Layer>) =>
        patchState(store, updaters.setLayerProperties(id, properties)),

      toggleVisibility: (id: string) => patchState(store, updaters.toggleVisibility(id)),

      toggleLock: (id: string) => patchState(store, updaters.toggleLock(id)),

      setLayerName: (id: string, name: string) =>
        patchState(store, updaters.setLayerName(id, name)),

      setOpacity: (id: string, opacity: number) =>
        patchState(store, updaters.setOpacity(id, opacity)),

      setBlendMode: (id: string, blendMode: BlendMode) =>
        patchState(store, updaters.setBlendMode(id, blendMode)),

      addCollection: (collection: LayerCollection) =>
        patchState(store, updaters.addCollection(collection)),

      removeCollection: (id: string) => patchState(store, updaters.removeCollection(id)),

      setCollectionName: (id: string, name: string) =>
        patchState(store, updaters.setCollectionName(id, name)),

      toggleCollectionCollapse: (id: string) =>
        patchState(store, updaters.toggleCollectionCollapse(id)),

      moveNode: (nodeRef: NodeRef, newParentId: string | null, targetIndex?: number) =>
        patchState(store, updaters.moveNode(nodeRef, newParentId, targetIndex)),

      reorderChildren: (parentId: string | null, newOrder: NodeRef[]) =>
        patchState(store, updaters.reorderChildren(parentId, newOrder)),

      getLayer: (id: string) => store.layers()[id] ?? null,

      getCollection: (id: string) => store.collections()[id] ?? null,

      getLayerItemName: (kind: LayerItemKind) => {
        patchState(store, updaters.increaseCount(kind));
        const order = store.counters()[kind];
        return NAME_FORMATTERS[kind](order);
      },

      getLayerSiblings: (parentId: string | null): NodeRef[] => {
        if (parentId === null) return store.rootChildren();
        return store.collections()[parentId]?.children ?? [];
      },
    })),
  );
}
