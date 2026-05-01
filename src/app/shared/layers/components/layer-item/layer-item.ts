import { Component, computed, inject, input } from '@angular/core';
import { LAYER_ITEM_OFFSET, NODE_ITEM_OFFSET } from '../../../../core/constants/layers.constants';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';
import { Layer } from '../../../../core/models/layers';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { Icon } from '../../../icons/components/icon/icon';

@Component({
  selector: 'app-layer-item',
  imports: [Icon],
  templateUrl: './layer-item.html',
  styleUrl: './layer-item.scss',
  host: {
    '[class.active-option]': 'isActive()',
    '[style]': 'indentStyle()',
    '(click)': 'onSelect()',
  },
})
export class LayerItem {
  public readonly layer = input.required<Layer>();
  public readonly depth = input.required<number>();

  protected readonly store = inject(LAYER_STORE);

  protected readonly isActive = computed(() => this.store.activeLayerId() === this.layer().id);
  protected readonly indentStyle = computed(() => ({
    paddingLeft: `${this.depth() * NODE_ITEM_OFFSET + LAYER_ITEM_OFFSET}px`,
  }));

  protected onSelect(): void {
    this.store.setActiveLayer(this.layer().id);
  }

  protected toggleVisibility(event: Event): void {
    event.stopPropagation();
    this.store.toggleVisibility(this.layer().id);
  }

  protected toggleLock(event: Event): void {
    event.stopPropagation();
    this.store.toggleLock(this.layer().id);
  }

  protected openSettings(event: Event): void {
    event.stopPropagation();
    // TODO: open model window
  }

  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
}
