import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { BlendMode, LayerCollection, LayerItemKind, NodeRef, PixelLayer } from '../../models/layers';
import { createInitialLayerSlice } from './layer.slice';
import * as updaters from './layer.updaters';
import { increaseCount } from './layer.updaters';
import { NAME_FORMATTERS } from '../../constants/layers.constants';

export const SpriteLayerStore = signalStore(
  withState(createInitialLayerSlice<PixelLayer>()),
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

      layersInRenderOrder: computed(() => {
        const result: PixelLayer[] = [];

        function collectLayers(children: NodeRef[]): void {
          for (const child of children) {
            if (child.type === 'layer') {
              const layer = store.layers()[child.id];
              if (layer) result.push(layer);
            } else {
              const collection = store.collections()[child.id];
              if (collection) collectLayers(collection.children);
            }
          }
        }

        collectLayers(store.rootChildren());
        return result;
      }),
    };
  }),
  withMethods((store) => {
    return {
      addLayer: (layer: PixelLayer) => patchState(store, updaters.addLayer<PixelLayer>(layer)),

      removeLayer: (id: string) => patchState(store, updaters.removeLayer<PixelLayer>(id)),

      setActiveLayer: (id: string | null) =>
        patchState(store, updaters.setActiveLayer<PixelLayer>(id)),

      toggleVisibility: (id: string) =>
        patchState(store, updaters.toggleVisibility<PixelLayer>(id)),

      toggleLock: (id: string) => patchState(store, updaters.toggleLock<PixelLayer>(id)),

      setLayerName: (id: string, name: string) =>
        patchState(store, updaters.setLayerName<PixelLayer>(id, name)),

      setOpacity: (id: string, opacity: number) =>
        patchState(store, updaters.setOpacity<PixelLayer>(id, opacity)),

      setBlendMode: (id: string, blendMode: BlendMode) =>
        patchState(store, updaters.setBlendMode<PixelLayer>(id, blendMode)),

      addCollection: (collection: LayerCollection) =>
        patchState(store, updaters.addCollection<PixelLayer>(collection)),

      removeCollection: (id: string) =>
        patchState(store, updaters.removeCollection<PixelLayer>(id)),

      setCollectionName: (id: string, name: string) =>
        patchState(store, updaters.setCollectionName<PixelLayer>(id, name)),

      toggleCollectionCollapse: (id: string) =>
        patchState(store, updaters.toggleCollectionCollapse<PixelLayer>(id)),

      moveNode: (nodeRef: NodeRef, newParentId: string | null, targetIndex?: number) =>
        patchState(store, updaters.moveNode<PixelLayer>(nodeRef, newParentId, targetIndex)),

      reorderChildren: (parentId: string | null, newOrder: NodeRef[]) =>
        patchState(store, updaters.reorderChildren<PixelLayer>(parentId, newOrder)),

      getLayer: (id: string) => store.layers()[id] ?? null,

      getCollection: (id: string) => store.collections()[id] ?? null,

      getLayerItemName: (kind: LayerItemKind) => {
        patchState(store, updaters.increaseCount<PixelLayer>(kind));
        const order = store.counters()[kind];
        return NAME_FORMATTERS[kind](order);
      }
    };
  }),
);
