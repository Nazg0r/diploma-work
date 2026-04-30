import { PartialStateUpdater } from '@ngrx/signals';
import { BlendMode, Layer, LayerCollection, NodeRef } from '../../models/layers';
import * as helper from './layer-tree.helpers';
import { LayerSlice } from './layer.slice';

function updateLayer<T extends Layer>(
  id: string,
  updater: (layer: T) => T,
): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const layer = store.layers[id];
    if (!layer) return {};

    return {
      layers: {
        ...store.layers,
        [id]: updater(layer),
      },
    };
  };
}

export function addLayer<T extends Layer>(layer: T): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const ref: NodeRef = { type: 'layer', id: layer.id };

    return {
      layers: { ...store.layers, [layer.id]: layer },
      activeLayerId: layer.id,
      ...helper.updateChildren(layer.parentId, store, (children) => [...children, ref]),
    };
  };
}

export function removeLayer<T extends Layer>(id: string): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const layer = store.layers[id];
    if (!layer) return {};

    const { [id]: _, ...rest } = store.layers;

    return {
      layers: rest,
      activeLayerId: store.activeLayerId === id ? null : store.activeLayerId,
      ...helper.removeFromParent(id, layer.parentId, store),
    };
  };
}

export function setActiveLayer<T extends Layer>(
  id: string | null,
): PartialStateUpdater<LayerSlice<T>> {
  return (_) => ({
    activeLayerId: id,
  });
}

export const toggleVisibility = <T extends Layer>(id: string) =>
  updateLayer<T>(id, (layer) => ({
    ...layer,
    isVisible: !layer.isVisible,
  }));

export const toggleLock = <T extends Layer>(id: string) =>
  updateLayer<T>(id, (layer) => ({ ...layer, isLocked: !layer.isLocked }));

export const setLayerName = <T extends Layer>(id: string, name: string) =>
  updateLayer<T>(id, (layer) => ({ ...layer, name }));

export const setOpacity = <T extends Layer>(id: string, opacity: number) =>
  updateLayer<T>(id, (layer) => ({
    ...layer,
    opacity: Math.min(1, Math.max(0, opacity)),
  }));

export const setBlendMode = <T extends Layer>(id: string, blendMode: BlendMode) =>
  updateLayer<T>(id, (layer) => ({ ...layer, blendMode }));

function updateCollection<T extends Layer>(
  id: string,
  updater: (collection: LayerCollection) => LayerCollection,
): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const collection = store.collections[id];
    if (!collection) return {};

    return {
      collections: {
        ...store.collections,
        [id]: updater(collection),
      },
    };
  };
}

export function addCollection<T extends Layer>(
  collection: LayerCollection,
): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const ref: NodeRef = { type: 'collection', id: collection.id };

    return {
      collections: { ...store.collections, [collection.id]: collection },
      ...helper.updateChildren(collection.parentId, store, (children) => [...children, ref]),
    };
  };
}

export function removeCollection<T extends Layer>(id: string): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    const collection = store.collections[id];
    if (!collection) return {};

    const layerIdsToRemove = helper.getDescendantLayerIds(id, store);
    const collectionIdsToRemove = helper.getDescendantCollectionIds(id, store);

    const layers = { ...store.layers };
    for (const layerId of layerIdsToRemove) {
      delete layers[layerId];
    }

    const collections = { ...store.collections };
    for (const colId of collectionIdsToRemove) {
      delete collections[colId];
    }

    return {
      layers,
      collections,
      activeLayerId: layerIdsToRemove.includes(store.activeLayerId ?? '')
        ? null
        : store.activeLayerId,
      ...helper.removeFromParent(id, collection.parentId, store),
    };
  };
}

export const setCollectionName = <T extends Layer>(id: string, name: string) =>
  updateCollection<T>(id, (collection) => ({ ...collection, name }));

export const toggleCollectionCollapse = <T extends Layer>(id: string) =>
  updateCollection<T>(id, (collection) => ({
    ...collection,
    isCollapsed: !collection.isCollapsed,
  }));

export function reorderChildren<T extends Layer>(
  parentId: string | null,
  newOrder: NodeRef[],
): PartialStateUpdater<LayerSlice<T>> {
  return (store) => helper.updateChildren(parentId, store, () => newOrder);
}

export function moveNode<T extends Layer>(
  nodeRef: NodeRef,
  newParentId: string | null,
  targetOrderIndex?: number,
): PartialStateUpdater<LayerSlice<T>> {
  return (store) => {
    if (nodeRef.type === 'collection' && newParentId !== null) {
      if (nodeRef.id === newParentId || helper.isDescendantOf(newParentId, nodeRef.id, store)) {
        return {};
      }
    }

    const currentParentId = helper.getParentId(nodeRef, store);
    if (currentParentId === undefined) return {};

    const removedFromOldParent = helper.removeFromParent(nodeRef.id, currentParentId, store);
    const storeAfterRemove = { ...store, ...removedFromOldParent } as LayerSlice<T>;

    const addedToNewParent = helper.updateChildren(newParentId, storeAfterRemove, (children) => {
      const order = [...children];
      if (targetOrderIndex !== undefined && targetOrderIndex >= 0) {
        order.splice(targetOrderIndex, 0, nodeRef);
      } else {
        order.push(nodeRef);
      }
      return order;
    });

    const nodeUpdate =
      nodeRef.type === 'layer'
        ? {
            layers: {
              ...storeAfterRemove.layers,
              [nodeRef.id]: {
                ...storeAfterRemove.layers[nodeRef.id],
                parentId: newParentId,
              },
            },
          }
        : {
            collections: {
              ...storeAfterRemove.collections,
              [nodeRef.id]: {
                ...storeAfterRemove.collections[nodeRef.id],
                parentId: newParentId,
              },
            },
          };

    return { ...removedFromOldParent, ...addedToNewParent, ...nodeUpdate };
  };
}
