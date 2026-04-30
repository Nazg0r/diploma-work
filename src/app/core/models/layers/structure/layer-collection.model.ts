import { NodeRef } from './layer-tree.model';

export interface LayerCollection {
  id: string;
  name: string;
  isCollapsed: boolean;
  parentId: string | null;
  children: NodeRef[];
}
