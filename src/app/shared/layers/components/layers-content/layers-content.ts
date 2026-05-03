import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { AddCollectionCommand, AddLayerCommand, MoveNodeCommand } from '../../../../core/commands';
import {
  createLayerCollection,
  createPixelLayer,
} from '../../../../core/factories/layer.factories';
import { DropEvent, DropPosition, NodeRef } from '../../../../core/models/layers';
import { DragContextService } from '../../../../core/services/drag-context.service';
import { ThumbnailService } from '../../../../core/services/thumbnail.service';
import { HistoryStore } from '../../../../core/stores/history/history.store';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { LayerNode } from '../layer-node/layer-node';
import { LayersFooter } from '../layers-footer/layers-footer';
import { LayersHeader } from '../layers-header/layers-header';

type ResolveResult =
  | { newParentId: string | null; targetIndex: number }
  | { newParentId: undefined; targetIndex: number };

@Component({
  selector: 'app-layers-content',
  imports: [LayersHeader, LayersFooter, LayerNode],
  templateUrl: './layers-content.html',
  styleUrl: './layers-content.scss',
  providers: [DragContextService, ThumbnailService],
})
export class LayersContent implements AfterViewInit {
  protected readonly store = inject(LAYER_STORE);
  private readonly historyStore = inject(HistoryStore);
  private readonly dragCtx = inject(DragContextService);

  protected readonly rootChildren = computed(() => [...this.store.rootChildren()].reverse());

  ngAfterViewInit(): void {
    const collection = createLayerCollection('Collection');
    const collection1 = createLayerCollection('Collection1');
    const collection2 = createLayerCollection('Collection2', collection1.id);
    collection1.parentId = collection.id;

    const layer = createPixelLayer(`Layer 1`, { height: 10, width: 10 });
    layer.parentId = collection2.id;

    this.historyStore.execute(new AddCollectionCommand(collection, this.store));
    this.historyStore.execute(new AddCollectionCommand(collection1, this.store));
    this.historyStore.execute(new AddCollectionCommand(collection2, this.store));
    this.historyStore.execute(new AddLayerCommand(layer, this.store));
  }

  protected onDrop(event: DropEvent): void {
    const { newParentId, targetIndex } = this.resolveDropTarget(event);
    if (newParentId === undefined) return;
    this.historyStore.execute(
      new MoveNodeCommand(this.store, event.source, newParentId, targetIndex),
    );
  }

  protected onRootDragOver(e: DragEvent): void {
    if (!this.dragCtx.draggingNode()) return;
    const target = e.target as HTMLElement;
    if (target.closest('.layer-item, .collection-item__header')) return;
    e.preventDefault();
  }

  protected onRootDrop(e: DragEvent): void {
    e.preventDefault();
    const source = this.dragCtx.draggingNode();
    if (!source) return;
    this.historyStore.execute(new MoveNodeCommand(this.store, source, null, 0));
    this.dragCtx.endDrag();
  }

  private resolveDropTarget(event: DropEvent): ResolveResult {
    const { source, target, position } = event;

    if (position === 'into' && target.type === 'collection') {
      return this.resolveDropIntoCollection(source, target);
    }

    return this.resolveDropBeforeAfterNode(source, target, position);
  }

  private resolveDropIntoCollection(source: NodeRef, target: NodeRef): ResolveResult {
    if (source.type === 'collection' && this.wouldCreateCycle(source.id, target.id)) {
      return { newParentId: undefined, targetIndex: -1 };
    }

    const collection = this.store.getCollection(target.id);
    const childCount = collection?.children.length ?? 0;
    return { newParentId: target.id, targetIndex: childCount };
  }

  private resolveDropBeforeAfterNode(
    source: NodeRef,
    target: NodeRef,
    position: DropPosition,
  ): ResolveResult {
    const targetParentId = this.getNodeParentId(target);
    const siblings = this.getSiblings(targetParentId);
    const placementIndex = this.calculatePlacementIndex(siblings, source, target, position);

    if (placementIndex === -1) return { newParentId: undefined, targetIndex: -1 };

    if (source.type === 'collection' && targetParentId !== null) {
      if (this.wouldCreateCycle(source.id, targetParentId)) {
        return { newParentId: undefined, targetIndex: -1 };
      }
    }

    return { newParentId: targetParentId, targetIndex: placementIndex };
  }

  private getNodeParentId(ref: NodeRef): string | null {
    return ref.type === 'layer'
      ? (this.store.getLayer(ref.id)?.parentId ?? null)
      : (this.store.getCollection(ref.id)?.parentId ?? null);
  }

  private getSiblings(parentId: string | null) {
    return parentId === null
      ? this.store.rootChildren()
      : (this.store.getCollection(parentId)?.children ?? []);
  }

  private calculatePlacementIndex(
    siblings: NodeRef[],
    source: NodeRef,
    target: NodeRef,
    position: DropPosition,
  ): number {
    let targetIndex = siblings.findIndex((ref) => ref.id === target.id);
    const sourceIndex = siblings.findIndex((ref) => ref.id === source.id);

    if (targetIndex === -1) return -1;

    if (sourceIndex === -1) {
      if (position === 'after') targetIndex += 1;
    } else {
      if (sourceIndex < targetIndex && position === 'before') targetIndex -= 1;
      if (sourceIndex > targetIndex && position === 'after') targetIndex += 1;
    }

    return targetIndex;
  }

  private wouldCreateCycle(sourceId: string, targetParentId: string): boolean {
    if (sourceId === targetParentId) return true;

    let current: string | null = targetParentId;
    while (current) {
      if (current === sourceId) return true;
      current = this.store.getCollection(current)?.parentId ?? null;
    }
    return false;
  }
}
