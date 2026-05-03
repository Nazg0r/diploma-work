import { NodeRef } from '../structure/layer-tree.model';

export type DropPosition = 'before' | 'into' | 'after';

export interface DropTarget {
  nodeRef: NodeRef;
  position: DropPosition;
}

export interface DropEvent {
  source: NodeRef;
  target: NodeRef;
  position: DropPosition;
}
