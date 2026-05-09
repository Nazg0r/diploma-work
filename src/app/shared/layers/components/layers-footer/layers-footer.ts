import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';
import { OptionsBinding } from '../../../../core/models/building-blocks';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { OptionsList } from '../../../building-blocks/components/options-list/options-list';
import { ClickOutside } from '../../../building-blocks/directives/click-outside';
import { Icon } from '../../../icons/components/icon/icon';
import { LayerActionsService } from '../../services/layer-actions.service';

@Component({
  selector: 'app-layers-footer',
  imports: [Icon, OptionsList, ClickOutside],
  templateUrl: './layers-footer.html',
  styleUrl: './layers-footer.scss',
  providers: [LayerActionsService],
})
export class LayersFooter {
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;

  private readonly layerStore = inject(LAYER_STORE);
  protected readonly actions = inject(LayerActionsService);

  private readonly addLayerItemRef = viewChild.required<ElementRef<HTMLDivElement>>('addLayerItem');

  protected readonly isAddLayerItemOptionsVisible = signal<boolean>(false);

  protected readonly hasActiveLayer = computed(() => this.layerStore.activeLayerId() !== null);

  protected readonly addLayerItemBindings: OptionsBinding[] = [
    { option: 'Add layer', action: this.actions.addLayer },
    { option: 'Add Collection', action: this.actions.addCollection },
  ];

  protected toggleLayerItemOptionsVisibility() {
    this.isAddLayerItemOptionsVisible.update((value) => !value);
  }

  protected onLayerItemOptionSelected() {
    this.isAddLayerItemOptionsVisible.set(false);
  }

  protected readonly addItemOptionsAppearanceHandler = (e: PointerEvent) => {
    if (!this.addLayerItemRef().nativeElement.contains(e.target as Node)) {
      this.isAddLayerItemOptionsVisible.set(false);
    }
  };
}
