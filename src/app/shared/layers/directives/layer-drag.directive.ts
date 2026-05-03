import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { DropEvent, DropPosition, NodeRef } from '../../../core/models/layers';
import {
  DragContextService,
} from '../../../core/services/drag-context.service';

@Directive({
  selector: '[appLayerDrag]',
  host: {
    '[draggable]': 'true',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class LayerDragDirective {
  public readonly nodeRef = input.required<NodeRef>({ alias: 'appLayerDrag' });
  public readonly canAcceptInto = input<boolean>(false);
  public readonly dropNode = output<DropEvent>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly dragCtx = inject(DragContextService);

  protected onDragStart(e: DragEvent): void {
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.nodeRef().id);
    }

    this.dragCtx.startDrag(this.nodeRef());
  }

  protected onDragEnd(): void {
    this.dragCtx.endDrag();
  }

  protected onDragOver(e: DragEvent): void {
    const dragging = this.dragCtx.draggingNode();
    if (!dragging) return;

    if (dragging.id === this.nodeRef().id) return;

    e.preventDefault();
    e.stopPropagation();

    const position = this.calculatePosition(e);
    if (position === null) {
      this.dragCtx.updateTarget(null);
      return;
    }

    this.dragCtx.updateTarget({ nodeRef: this.nodeRef(), position });
  }

  protected onDragLeave(e: DragEvent): void {
    const related = e.relatedTarget as Node | null;
    if (related && this.host.nativeElement.contains(related)) return;

    const target = this.dragCtx.currentTarget();
    if (target?.nodeRef.id === this.nodeRef().id) {
      this.dragCtx.updateTarget(null);
    }
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const dragging = this.dragCtx.draggingNode();
    const target = this.dragCtx.currentTarget();
    if (!dragging || !target) return;
    if (dragging.id === this.nodeRef().id) return;

    this.dropNode.emit({
      source: dragging,
      target: target.nodeRef,
      position: target.position,
    });

    this.dragCtx.endDrag();
  }

  private calculatePosition(e: DragEvent): DropPosition | null {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = y / rect.height;

    if (this.canAcceptInto()) {
      if (ratio < 0.25) return 'after';
      if (ratio > 0.75) return 'before';
      return 'into';
    }

    return ratio < 0.5 ? 'after' : 'before';
  }
}
