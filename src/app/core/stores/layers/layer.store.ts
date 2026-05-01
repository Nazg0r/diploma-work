import { BlendMode, Layer, LayerCollection, LayerItemKind, NodeRef } from '../../models/layers';
import { Signal } from '@angular/core';

export interface LayerStore<T extends Layer> {
  readonly layers: Signal<Record<string, T>>;
  readonly collections: Signal<Record<string, LayerCollection>>;
  readonly activeLayerId: Signal<string | null>;
  readonly rootChildren: Signal<NodeRef[]>;

  readonly activeLayer: Signal<T | null>;
  readonly visibleLayers: Signal<T[]>;
  readonly layersCount: Signal<number>;

  addLayer(layer: T): void;
  removeLayer(id: string): void;
  setActiveLayer(id: string | null): void;
  toggleVisibility(id: string): void;
  toggleLock(id: string): void;
  setLayerName(id: string, name: string): void;
  setOpacity(id: string, opacity: number): void;
  setBlendMode(id: string, blendMode: BlendMode): void;

  addCollection(collection: LayerCollection): void;
  removeCollection(id: string): void;
  setCollectionName(id: string, name: string): void;
  toggleCollectionCollapse(id: string): void;

  moveNode(nodeRef: NodeRef, newParentId: string | null, targetIndex?: number): void;
  reorderChildren(parentId: string | null, newOrder: NodeRef[]): void;

  getLayer(id: string): T | null;
  getCollection(id: string): LayerCollection | null;
  getLayerItemName(kind: LayerItemKind) : string;
}
