import { Component, computed, forwardRef, inject, input } from '@angular/core';
import { LayerNode } from '../';
import {
  COLLECTION_ITEM_OFFSET,
  NODE_ITEM_OFFSET,
} from '../../../../core/constants/layers.constants';
import { MD_ICON_SIZE, SM_ICON_SIZE } from '../../../../core/constants/size.constants';
import { LayerCollection } from '../../../../core/models/layers';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { Icon } from '../../../icons/components/icon/icon';

@Component({
  selector: 'app-collection-item',
  imports: [Icon, forwardRef(() => LayerNode)],
  templateUrl: './collection-item.html',
  styleUrl: './collection-item.scss',
})
export class CollectionItem {
  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;

  public readonly collection = input.required<LayerCollection>();
  public readonly depth = input.required<number>();

  private readonly store = inject(LAYER_STORE);

  protected readonly indentStyle = computed(() => ({
    paddingLeft: `${this.depth() * NODE_ITEM_OFFSET + COLLECTION_ITEM_OFFSET}px`,
  }));

  protected toggleCollapse(): void {
    this.store.toggleCollectionCollapse(this.collection().id);
  }
}
