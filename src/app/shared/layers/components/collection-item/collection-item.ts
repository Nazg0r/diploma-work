import { Component, computed, forwardRef, inject, input, output } from '@angular/core';
import { LayerNode } from '../';
import {
  COLLECTION_ITEM_OFFSET,
  NODE_ITEM_OFFSET,
} from '../../../../core/constants/layers.constants';
import { MD_ICON_SIZE, SM_ICON_SIZE } from '../../../../core/constants/size.constants';
import { DropEvent, LayerCollection, NodeRef } from '../../../../core/models/layers';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { Icon } from '../../../icons/components/icon/icon';
import { LayerDragDirective } from '../../directives/layer-drag.directive';
import { LayerDropIndicator } from '../../directives/layer-drop-indicator.directive';
import { HistoryManagerService } from '../../../../core/services/history-manager.service';
import { RenameLayerCommand } from '../../../../core/commands/layers/rename-layer.command';
import { RenameCollectionCommand } from '../../../../core/commands/layers/rename-collection.command';
import { RenameDirective } from '../../directives/rename.directive';

@Component({
  selector: 'app-collection-item',
  imports: [
    Icon,
    forwardRef(() => LayerNode),
    LayerDragDirective,
    LayerDropIndicator,
    RenameDirective,
  ],
  templateUrl: './collection-item.html',
  styleUrl: './collection-item.scss',
})
export class CollectionItem {
  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;

  public readonly collection = input.required<LayerCollection>();
  public readonly depth = input.required<number>();
  public readonly dropNode = output<DropEvent>();

  private readonly store = inject(LAYER_STORE);
  private readonly historyService = inject(HistoryManagerService);

  protected readonly children = computed(() => [...this.collection().children].reverse());
  protected readonly indentStyle = computed(() => ({
    paddingLeft: `${this.depth() * NODE_ITEM_OFFSET + COLLECTION_ITEM_OFFSET}px`,
  }));
  protected readonly nodeRef = computed<NodeRef>(() => ({
    type: 'collection',
    id: this.collection().id,
  }));

  protected toggleCollapse(): void {
    this.store.toggleCollectionCollapse(this.collection().id);
  }

  protected onDrop(event: DropEvent): void {
    this.dropNode.emit(event);
  }

  protected onRename(newName: string): void {
    this.historyService.execute(
      new RenameCollectionCommand(
        this.store,
        this.collection().id,
        newName,
        this.collection().name,
      ),
    );
  }
}
