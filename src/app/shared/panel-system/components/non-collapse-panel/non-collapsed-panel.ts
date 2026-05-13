import { Component, computed } from '@angular/core';
import { Icon } from '../../../icons/components/icon/icon';
import { PanelBase } from '../../directives/panel-base';
import { PanelDrag } from '../../directives/panel-drag';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';

@Component({
  selector: 'app-non-collapse-panel',
  imports: [Icon, PanelDrag],
  templateUrl: './non-collapsed-panel.html',
  styleUrl: './non-collapsed-panel.scss',
  host: {
    '[style]': 'panelStyles()',
    '(pointerdown)': 'onPointerDown()',
  },
})
export class NonCollapsedPanel extends PanelBase {
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
