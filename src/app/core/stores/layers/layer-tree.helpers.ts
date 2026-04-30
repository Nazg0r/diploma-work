import { Layer, NodeRef } from '../../models/layers';
import { LayerSlice } from './layer.slice';

export function getChildrenOf<T extends Layer>(
  parentId: string | null,
  store: LayerSlice<T>,
): NodeRef[] {
  if (parentId === null) return store.rootChildren;
  return store.collections[parentId]?.children ?? [];
}

export function updateChildren<T extends Layer>(
  parentId: string | null,
  store: LayerSlice<T>,
  updater: (children: NodeRef[]) => NodeRef[],
): Partial<LayerSlice<T>> {
  if (parentId === null) {
    return { rootChildren: updater(store.rootChildren) };
  }

  const collection = store.collections[parentId];
  if (!collection) return {};

  return {
    collections: {
      ...store.collections,
      [parentId]: { ...collection, children: updater(collection.children) },
    },
  };
}

export function isDescendantOf<T extends Layer>(
  targetCollectionId: string,
  ancestorCollectionId: string,
  store: LayerSlice<T>,
): boolean {
  const target = store.collections[targetCollectionId];
  if (!target) return false;
  if (target.parentId === ancestorCollectionId) return true;
  if (target.parentId === null) return false;
  return isDescendantOf(target.id, ancestorCollectionId, store);
}

export function removeFromParent<T extends Layer>(
  targetId: string,
  parentId: string | null,
  store: LayerSlice<T>,
): Partial<LayerSlice<T>> {
  return updateChildren(parentId, store, (children) =>
    children.filter((ref) => ref.id !== targetId),
  );
}

export function getDescendantLayerIds<T extends Layer>(
  collectionId: string,
  store: LayerSlice<T>,
): string[] {
  const collection = store.collections[collectionId];
  if (!collection) return [];

  const result = [];
  for (const child of collection.children) {
    if (child.type === 'collection') {
      result.push(...getDescendantLayerIds(child.id, store));
    } else {
      result.push(child.id);
    }
  }

  return result;
}

export function getDescendantCollectionIds<T extends Layer>(
  collectionId: string,
  store: LayerSlice<T>,
): string[] {
  const collection = store.collections[collectionId];
  if (!collection) return [];

  const result = [collectionId];
  for (const child of collection.children) {
    if (child.type === 'collection') {
      result.push(...getDescendantCollectionIds(child.id, store));
    }
  }

  return result;
}

export function getParentId<T extends Layer>(
  nodeRef: NodeRef,
  store: LayerSlice<T>,
): string | null | undefined {
  return nodeRef.type === 'layer'
    ? store.layers[nodeRef.id]?.parentId
    : store.collections[nodeRef.id]?.parentId;
}
