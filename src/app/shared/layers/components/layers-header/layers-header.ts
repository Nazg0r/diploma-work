import { Component, inject, signal } from '@angular/core';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { Checkbox } from '../../../building-blocks/components/checkbox/checkbox';

@Component({
  selector: 'app-layers-header',
  imports: [Checkbox],
  templateUrl: './layers-header.html',
  styleUrl: './layers-header.scss',
})
export class LayersHeader {
  protected readonly store = inject(LAYER_STORE);
  protected toggleAllHiddenOn = signal(false);
  protected toggleLockAllOn = signal(false);

  protected toggleHideAll(): void {
    this.toggleAllHiddenOn.set(!this.toggleAllHiddenOn());
    for (const layer of Object.values(this.store.layers())) {
      if (layer.isVisible !== !this.toggleAllHiddenOn()) {
        this.store.toggleVisibility(layer.id);
      }
    }
  }

  protected toggleLockAll(): void {
    this.toggleLockAllOn.set(!this.toggleLockAllOn());
    for (const layer of Object.values(this.store.layers())) {
      if (layer.isLocked !== this.toggleLockAllOn()) {
        this.store.toggleLock(layer.id);
      }
    }
  }
}
