import { Layer, LayerCollection, NodeRef } from '../../models/layers';
import { Command } from '../command.interface';

interface LayerStoreApi {
  getLayer(id: string): Layer | null;
  getCollection(id: string): LayerCollection | null;
  moveNode(nodeRef: NodeRef, newParentId: string | null, targetIndex?: number): void;
}

export class MoveNodeUpCommand implements Command {
  public readonly id = 'move-node-up';
  public label: string;

  constructor(
    private readonly nodeRef: NodeRef,
    private readonly parentId: string | null,
    private readonly index: number,
    private readonly store: LayerStoreApi,
  ) {
    this.label =
      nodeRef.type === 'layer'
        ? `Move ${this.store.getLayer(nodeRef.id)} Up`
        : `Move ${this.store.getCollection(nodeRef.id)} Up`;
  }

  execute(): void {
    this.store.moveNode(this.nodeRef, this.parentId, this.index + 1);
  }

  undo(): void {
    this.store.moveNode(this.nodeRef, this.parentId, this.index);
  }
}
