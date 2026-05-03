import { Injectable, signal } from '@angular/core';
import { DropTarget, NodeRef } from '../models/layers';



@Injectable()
export class DragContextService {
  public readonly draggingNode = signal<NodeRef | null>(null);
  public readonly currentTarget = signal<DropTarget | null>(null);

  public startDrag(nodeRef: NodeRef): void {
    this.draggingNode.set(nodeRef);
  }

  public updateTarget(target: DropTarget | null): void {
    this.currentTarget.set(target);
  }

  public endDrag(): void {
    this.draggingNode.set(null);
    this.currentTarget.set(null);
  }
}
