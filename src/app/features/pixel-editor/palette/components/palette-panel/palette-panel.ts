import { Component, computed, inject } from '@angular/core';
import {
  MD_ICON_SIZE,
  SM_ICON_SIZE,
  SMX_ICON_SIZE,
  SP_ICON_SIZE,
} from '../../../../../core/constants/size.constants';
import { ColorStore } from '../../../../../core/stores/color/color.store';
import { PaletteStore } from '../../../../../core/stores/palette/palette.store';
import { Icon } from '../../../../../shared/icons/components/icon/icon';
import { NonCollapsedPanel } from '../../../../../shared/panel-system/components/non-collapse-panel/non-collapsed-panel';

@Component({
  selector: 'app-palette-panel',
  imports: [NonCollapsedPanel, Icon],
  templateUrl: './palette-panel.html',
  styleUrl: './palette-panel.scss',
})
export class PalettePanel {
  protected readonly paletteStore = inject(PaletteStore);
  protected readonly colorStore = inject(ColorStore);

  protected readonly colors = computed(() => this.paletteStore.currentPalette().colors);
  protected readonly foreground = computed(() => this.colorStore.foreground());
  protected readonly background = computed(() => this.colorStore.background());

  protected readonly SP_ICON_SIZE = SP_ICON_SIZE;
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  protected readonly SMX_ICON_SIZE = SMX_ICON_SIZE;

  protected onSwatchClick(index: number): void {
    const color = this.colors()[index];
    this.paletteStore.setActiveColorIndex(index);
    this.colorStore.setForeground(color);
  }

  protected onSwatchDoubleClick(index: number) {}

  protected onSwatchRightClick(index: number, e: MouseEvent): void {
    e.preventDefault();
    this.colorStore.setBackground(this.colors()[index]);
  }

  protected onAddColor() {}

  protected async onForegroundClick(): Promise<void> {}

  protected async onBackgroundClick(): Promise<void> {}

  protected onSwap(): void {
    this.colorStore.swap();
  }

  protected isActive(index: number): boolean {
    return this.paletteStore.activeColorIndex() === index;
  }

  protected onSettingsClick(): void {}
  protected onEyedropperClick(): void {}
}
