import { Component, computed, input } from '@angular/core';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';
import { Icon } from '../../../icons/components/icon/icon';
import { PanelBaseDirective } from '../../directives/panel-base.directive';
import { PanelDragDirective } from '../../directives/panel-drag.directive';
import { PanelResizeDirective } from '../../directives/panel-resize.directive';

@Component({
  selector: 'app-non-collapse-panel',
  imports: [Icon, PanelDragDirective, PanelResizeDirective],
  templateUrl: './non-collapsed-panel.html',
  styleUrl: './non-collapsed-panel.scss',
  host: {
    '[style]': 'panelStyles()',
    '(pointerdown)': 'onPointerDown()',
  },
})
export class NonCollapsedPanel extends PanelBaseDirective {
  public readonly isResizable = input<boolean>();

  protected readonly panelStyles = computed(() => {
    const { zIndex, size } = this.panel();
    return {
      ...this.horizontalPosition(),
      ...this.verticalPosition(),
      width: `${size.width}px`,
      height: `${size.height}px`,
      zIndex,
    };
  });

  protected onHideClick(e: PointerEvent): void {
    e.stopPropagation();
    this.resetPositionToAnchor();
  }

  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
}
