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

  private readonly store = inject(LAYER_STORE);
  protected readonly actions = inject(LayerActionsService);

  private readonly addItemRef = viewChild.required<ElementRef<HTMLDivElement>>('addItem');
  private readonly mergeRef = viewChild.required<ElementRef<HTMLDivElement>>('merge');

  protected readonly isAddItemOptionsVisible = signal<boolean>(false);
  protected readonly isMergeOptionsVisible = signal<boolean>(false);

  protected readonly hasActiveLayer = computed(() => this.store.activeLayerId() !== null);
  protected readonly canMoveUp = computed(() => this.store.canMoveUp());
  protected readonly canMoveDown = computed(() => this.store.canMoveDown());
  protected readonly canMergeUp = computed(() => this.store.canMergeUp());
  protected readonly canMergeDown = computed(() => this.store.canMergeDown());
  protected readonly mergeBindings = computed(() => {
    return [
      { option: 'Merge Up', action: this.actions.mergeUp, isDisabled: !this.canMergeUp() },
      { option: 'Merge Down', action: this.actions.mergeDown, isDisabled: !this.canMergeDown() },
    ];
  });

  protected readonly addItemBindings: OptionsBinding[] = [
    { option: 'Add layer', action: this.actions.addLayer },
    { option: 'Add Collection', action: this.actions.addCollection },
  ];

  protected toggleAddItemOptionsVisibility() {
    this.isAddItemOptionsVisible.update((value) => !value);
  }

  protected toggleMergeOptionsVisibility() {
    this.isMergeOptionsVisible.update((value) => !value);
  }

  protected onLayerItemOptionSelected() {
    this.isAddItemOptionsVisible.set(false);
  }

  protected onMergeOptionSelected() {
    this.isMergeOptionsVisible.set(false);
  }

  protected readonly addItemOptionsAppearanceHandler = (e: PointerEvent) => {
    if (!this.addItemRef().nativeElement.contains(e.target as Node)) {
      this.isAddItemOptionsVisible.set(false);
    }
  };

  protected readonly mergeOptionsAppearanceHandler = (e: PointerEvent) => {
    if (!this.mergeRef().nativeElement.contains(e.target as Node)) {
      this.isMergeOptionsVisible.set(false);
    }
  };
}
