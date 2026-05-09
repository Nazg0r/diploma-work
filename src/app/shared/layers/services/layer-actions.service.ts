import { inject, Injectable } from '@angular/core';
import {
  AddCollectionCommand,
  AddLayerCommand,
  MergeLayersCommand,
  MoveNodeDownCommand,
  MoveNodeUpCommand,
  RemoveLayerCommand,
} from '../../../core/commands';
import { createLayerCollection, createPixelLayer } from '../../../core/factories/layer.factories';
import { isPixelLayer, NodeRef } from '../../../core/models/layers';
import { HistoryManagerService } from '../../../core/services/history-manager.service';
import { LAYER_STORE } from '../../../core/stores/layers';
import { generateId } from '../../../core/utils/id-generation.utils';
import { CanvasStore } from '../../../features/pixel-editor/stores/canvas.store';

@Injectable()
export class LayerActionsService {
  private readonly layerStore = inject(LAYER_STORE);
  private readonly canvasStore = inject(CanvasStore);
  private readonly historyService = inject(HistoryManagerService);

  // TODO: modify on level editor mode
  addLayer = (): void => {
    const name = this.layerStore.getLayerItemName('pixel');
    const parentId = this.layerStore.activeLayer()?.parentId;
    const layer = createPixelLayer(name, this.canvasStore.canvasSize(), parentId);
    this.historyService.execute(new AddLayerCommand(layer, this.layerStore));
  };

  addCollection = (): void => {
    const name = this.layerStore.getLayerItemName('collection');
    const parentId = this.layerStore.activeLayer()?.parentId;
    const collection = createLayerCollection(name, parentId);
    this.historyService.execute(new AddCollectionCommand(collection, this.layerStore));
  };

  duplicate(): void {
    const active = this.layerStore.activeLayer();
    if (!active || !isPixelLayer(active)) return;

    const data = new ImageData(
      new Uint8ClampedArray(active.data.data),
      active.size.width,
      active.size.height,
    );
    const duplicate = { ...active, id: generateId(), name: `${active.name} copy`, data };
    this.historyService.execute(new AddLayerCommand(duplicate, this.layerStore));
  }

  mergeDown = (): void =>
    this.historyService.execute(new MergeLayersCommand(this.layerStore, 'down'));

  mergeUp = (): void => this.historyService.execute(new MergeLayersCommand(this.layerStore, 'up'));

  // TODO: modify on level editor mode
  move(direction: 'up' | 'down'): void {
    const active = this.layerStore.activeLayer();
    if (!active) return;

    const nodeRef: NodeRef = { id: active.id, type: 'layer' };
    const siblings = this.layerStore.getLayerSiblings(active.parentId);
    const index = siblings.findIndex((n) => n.id === active.id);

    const isOutOfBounds = direction === 'up' ? index >= siblings.length - 1 : index === 0;
    if (isOutOfBounds) return;

    const command =
      direction === 'up'
        ? new MoveNodeUpCommand(nodeRef, active.parentId, index, this.layerStore)
        : new MoveNodeDownCommand(nodeRef, active.parentId, index, this.layerStore);

    this.historyService.execute(command);
  }

  remove(): void {
    const id = this.layerStore.activeLayerId();
    if (!id) return;
    this.historyService.execute(new RemoveLayerCommand(id, this.layerStore));
  }
}
