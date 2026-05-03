import { Directive, inject, input } from '@angular/core';
import { DropPosition, NodeRef } from '../../../core/models/layers';
import { DragContextService } from '../../../core/services/drag-context.service';

@Directive({
  selector: '[appLayerDropIndicator]',
  host: {
    '[class.layer-drag-indicator--before]': 'isPosition("before")',
    '[class.layer-drag-indicator--into]': 'isPosition("into")',
    '[class.layer-drag-indicator--after]': 'isPosition("after")',
  },
})
export class LayerDropIndicator {
  public readonly nodeRef = input.required<NodeRef>({ alias: 'appLayerDropIndicator' });
  protected readonly dragContext = inject(DragContextService);

  protected isPosition(position: DropPosition): boolean {
    const target = this.dragContext.currentTarget();
    return target?.nodeRef.id === this.nodeRef().id && target.position === position;
  }
}
