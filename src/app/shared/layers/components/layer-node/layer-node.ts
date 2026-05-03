import { Component, computed, inject, input, output } from '@angular/core';
import { DropEvent, NodeRef } from '../../../../core/models/layers';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { CollectionItem } from '../collection-item/collection-item';
import { LayerItem } from '../layer-item/layer-item';

@Component({
  selector: 'app-layer-node',
  imports: [CollectionItem, LayerItem],
  templateUrl: './layer-node.html',
})
export class LayerNode {
  public readonly nodeRef = input.required<NodeRef>();
  public readonly depth = input.required<number>();

  public readonly dropNode = output<DropEvent>();

  protected readonly store = inject(LAYER_STORE);

  protected readonly isLayer = computed(() => this.nodeRef().type === 'layer');

  protected readonly layer = computed(() => {
    if (this.nodeRef().type !== 'layer') return null;
    return this.store.layers()[this.nodeRef().id] ?? null;
  });

  protected readonly collection = computed(() => {
    if (this.nodeRef().type !== 'collection') return null;
    return this.store.collections()[this.nodeRef().id] ?? null;
  });

  protected onDrop(event: DropEvent): void {
    this.dropNode.emit(event);
  }
}
