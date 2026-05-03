import { Layer, NodeRef } from '../../models/layers';
import { LayerStore } from '../../stores/layers';
import { Command } from '../command.interface';

export class MoveNodeCommand implements Command {
  public readonly id: string = 'move-node';
  public readonly label: string = 'Move Node';

  private previousParentId: string | null = null;
  private previousIndex: number = -1;

  constructor(
    private readonly store: LayerStore<Layer>,
    private readonly nodeRef: NodeRef,
    private readonly newParentId: string | null,
    private readonly targetIndex: number,
  ) {
    this.label = nodeRef.type === 'layer' ? 'Move Layer' : 'Move Collection';
  }

  execute(): void {
    this.snapshotPreviousPosition();
    this.store.moveNode(this.nodeRef, this.newParentId, this.targetIndex);
  }
  undo(): void {
    this.store.moveNode(this.nodeRef, this.previousParentId, this.previousIndex);
  }

  private snapshotPreviousPosition(): void {
    if (this.nodeRef.type === 'layer') {
      const layer = this.store.getLayer(this.nodeRef.id);
      if (!layer) return;
      this.previousParentId = layer.parentId;
    } else {
      const collection = this.store.getCollection(this.nodeRef.id);
      if (!collection) return;
      this.previousParentId = collection.parentId;
    }

    const siblings =
      this.previousParentId === null
        ? this.store.rootChildren()
        : (this.store.getCollection(this.previousParentId)?.children ?? []);

    this.previousIndex = siblings.findIndex((ref) => ref.id === this.nodeRef.id);
  }
}
