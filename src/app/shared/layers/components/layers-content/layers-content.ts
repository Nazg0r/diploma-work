import { AfterViewInit, Component, computed, inject, OnInit } from '@angular/core';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { LayerNode } from '../layer-node/layer-node';
import { LayersFooter } from '../layers-footer/layers-footer';
import { LayersHeader } from '../layers-header/layers-header';
import { HistoryStore } from '../../../../core/stores/history/history.store';
import {
  createLayerCollection,
  createPixelLayer,
} from '../../../../core/factories/layer.factories';
import { AddCollectionCommand } from '../../../../core/commands/layers/add-collection.command';
import { AddLayerCommand } from '../../../../core/commands';

@Component({
  selector: 'app-layers-content',
  imports: [LayersHeader, LayersFooter, LayerNode],
  templateUrl: './layers-content.html',
  styleUrl: './layers-content.scss',
})
export class LayersContent implements AfterViewInit {
  protected readonly store = inject(LAYER_STORE);
  protected readonly rootChildren = computed(() => [...this.store.rootChildren()].reverse());
  private readonly historyStore = inject(HistoryStore);

  ngAfterViewInit(): void {
    const collection = createLayerCollection("Collection");
    const collection1 = createLayerCollection('Collection1');
    const collection2 = createLayerCollection('Collection2', collection1.id);
    collection1.parentId = collection.id;

    const layer = createPixelLayer(`Layer 1`, {height:10, width:10});
    layer.parentId = collection2.id;

    this.historyStore.execute(new AddCollectionCommand(collection, this.store));
    this.historyStore.execute(new AddCollectionCommand(collection1, this.store));
    this.historyStore.execute(new AddCollectionCommand(collection2, this.store));
    this.historyStore.execute(new AddLayerCommand(layer, this.store));
  }
}
