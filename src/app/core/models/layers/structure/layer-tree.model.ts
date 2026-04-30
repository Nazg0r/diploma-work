export type NodeType = 'layer' | 'collection';

export interface NodeRef {
  type: NodeType;
  id: string;
}
