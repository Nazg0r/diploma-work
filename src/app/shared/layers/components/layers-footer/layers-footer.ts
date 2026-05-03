import { Component, computed, inject } from '@angular/core';
import {
  AddLayerCommand,
  MoveNodeDownCommand,
  MoveNodeUpCommand,
  RemoveLayerCommand,
} from '../../../../core/commands';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';
import { createPixelLayer } from '../../../../core/factories/layer.factories';
import { isPixelLayer, NodeRef } from '../../../../core/models/layers';
import { HistoryStore } from '../../../../core/stores/history/history.store';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { CanvasStore } from '../../../../features/pixel-editor/stores/canvas.store';
import { Icon } from '../../../icons/components/icon/icon';

@Component({
  selector: 'app-layers-footer',
  imports: [Icon],
  templateUrl: './layers-footer.html',
  styleUrl: './layers-footer.scss',
})
export class LayersFooter {
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;

  private readonly layerStore = inject(LAYER_STORE);
  private readonly canvasStore = inject(CanvasStore);
  private readonly historyStore = inject(HistoryStore);
  // TODO: replace with HistoryManagerService
  // private readonly history = inject(HistoryManagerService);

  protected readonly hasActiveLayer = computed(() => this.layerStore.activeLayerId() !== null);

  // TODO: modify on level editor mode
  protected addLayer(): void {
    const layerName = this.layerStore.getLayerItemName('pixel');
    const layer = createPixelLayer(layerName, this.canvasStore.canvasSize());

    this.historyStore.execute(new AddLayerCommand(layer, this.layerStore));
  }

  protected duplicateLayer(): void {
    const active = this.layerStore.activeLayer();
    if (!active) return;

    if (isPixelLayer(active)) {
      const data = new ImageData(
        new Uint8ClampedArray(active.data.data),
        active.size.width,
        active.size.height,
      );

      const duplicate = {
        ...active,
        id: crypto.randomUUID(),
        name: `${active.name} copy`,
        data,
      };
      this.historyStore.execute(new AddLayerCommand(duplicate, this.layerStore));
    }
  }
  protected mergeLayer(): void {
    // TODO:
  }

  protected moveUp(): void {
    const active = this.layerStore.activeLayer();
    if (!active) return;

    const nodeRef: NodeRef = {
      id: active.id,
      type: 'layer',
    };
    const index = this.getNodeIndex(
      active.id,
      active.parentId,
      (index, children) => index >= children.length - 1,
    );
    if (index === null) return;

    this.historyStore.execute(
      new MoveNodeUpCommand(nodeRef, active.parentId, index, this.layerStore),
    );
  }

  protected moveDown(): void {
    const active = this.layerStore.activeLayer();
    if (!active) return;

    const nodeRef: NodeRef = {
      id: active.id,
      type: 'layer',
    };

    const index = this.getNodeIndex(active.id, active.parentId, (index, _) => index === 0);
    if (index === null) return;

    this.historyStore.execute(
      new MoveNodeDownCommand(nodeRef, active.parentId, index, this.layerStore),
    );
  }

  protected deleteLayer(): void {
    const id = this.layerStore.activeLayerId();
    if (!id) return;

    this.historyStore.execute(new RemoveLayerCommand(id, this.layerStore));
  }

  private getNodeIndex(
    nodeId: string,
    parentId: string | null,
    extraChek: (index: number, children: NodeRef[]) => boolean,
  ): number | null {
    const children = this.getParentChildren(parentId);
    const index = children.findIndex((layer) => layer.id === nodeId);
    if (extraChek(index, children)) return null;
    return index;
  }

  private getParentChildren(parentId: string | null): NodeRef[] {
    if (parentId === null) {
      return this.layerStore.rootChildren();
    }
    return this.layerStore.collections()[parentId].children;
  }
}
