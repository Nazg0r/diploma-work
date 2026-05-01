import { LayerKind } from '../kinds/base-layer.model';

export type NodeType = 'layer' | 'collection';

export interface NodeRef {
  type: NodeType;
  id: string;
}

export type LayerItemKind = LayerKind | 'collection';

export type LayerCounters = Record<LayerItemKind, number>;
