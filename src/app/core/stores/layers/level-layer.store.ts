import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { BlendMode, LayerCollection, LevelLayer, NodeRef } from '../../models/layers';
import { createInitialLayerSlice } from './layer.slice';
import * as updaters from './layer.updaters';

export const LayerLayerStore = signalStore(
  { providedIn: 'root' },
  withState(createInitialLayerSlice<LevelLayer>()),
  withComputed((store) => {
    return {
      activeLayer: computed(() => {
        const id = store.activeLayerId();
        return id ? store.layers()[id] : null;
      }),
      visibleLayers: computed(() => {
        const layers = Object.values(store.layers());
        return layers.filter((layer) => layer.isVisible);
      }),
      layersCount: computed(() => Object.keys(store.layers()).length),
    };
  }),
  withMethods((store) => {
    return {
      addLayer: (layer: LevelLayer) => patchState(store, updaters.addLayer<LevelLayer>(layer)),

      removeLayer: (id: string) => patchState(store, updaters.removeLayer<LevelLayer>(id)),

      setActiveLayer: (id: string | null) =>
        patchState(store, updaters.setActiveLayer<LevelLayer>(id)),

      toggleVisibility: (id: string) =>
        patchState(store, updaters.toggleVisibility<LevelLayer>(id)),

      toggleLock: (id: string) => patchState(store, updaters.toggleLock<LevelLayer>(id)),

      setLayerName: (id: string, name: string) =>
        patchState(store, updaters.setLayerName<LevelLayer>(id, name)),

      setOpacity: (id: string, opacity: number) =>
        patchState(store, updaters.setOpacity<LevelLayer>(id, opacity)),

      setBlendMode: (id: string, blendMode: BlendMode) =>
        patchState(store, updaters.setBlendMode<LevelLayer>(id, blendMode)),

      addCollection: (collection: LayerCollection) =>
        patchState(store, updaters.addCollection<LevelLayer>(collection)),

      removeCollection: (id: string) =>
        patchState(store, updaters.removeCollection<LevelLayer>(id)),

      setCollectionName: (id: string, name: string) =>
        patchState(store, updaters.setCollectionName<LevelLayer>(id, name)),

      toggleCollectionCollapse: (id: string) =>
        patchState(store, updaters.toggleCollectionCollapse<LevelLayer>(id)),

      moveNode: (nodeRef: NodeRef, newParentId: string | null, targetIndex?: number) =>
        patchState(store, updaters.moveNode<LevelLayer>(nodeRef, newParentId, targetIndex)),

      reorderChildren: (parentId: string | null, newOrder: NodeRef[]) =>
        patchState(store, updaters.reorderChildren<LevelLayer>(parentId, newOrder)),

      getLayer: (id: string) => store.layers()[id] ?? null,

      getCollection: (id: string) => store.collections()[id] ?? null,
    };
  }),
);
