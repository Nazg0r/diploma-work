import { Component, computed, signal } from '@angular/core';
import {
  HIDDEN_PANEL_WIDTH,
  LG_ICON_SIZE,
  MD_ICON_SIZE,
  SM_ICON_SIZE,
} from '../../../../core/constants/size.constants';
import { ARROW_ROTATION } from '../../../../core/models/anchor.model';
import { Rect } from '../../../../core/models/canvas.model';
import { Icon } from '../../../icons/components/icon/icon';
import { PanelBase } from '../../directives/panel-base';
import { PanelDrag } from '../../directives/panel-drag';
import { PanelResize } from '../../directives/panel-resize';

@Component({
  selector: 'app-panel',
  imports: [PanelResize, PanelDrag, Icon],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'panelStyles()',
    '(pointerdown)': 'onPointerDown()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class Panel extends PanelBase {
  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
  protected readonly LG_ICON_SIZE = LG_ICON_SIZE;

  protected readonly isHovered = signal(false);
  protected readonly isHidden = computed(() => this.panel().state === 'hidden');
  protected readonly isExpanded = computed(() => this.panel().state === 'expanded');

  protected readonly hostClasses = computed(() => {
    const state = this.panel().state;
    const anchor = this.panel().anchor;
    return [
      'panel',
      `panel--${state}`,
      `panel--anchor-${anchor}`,
      this.isHidden() && this.isHovered() ? 'panel--peek' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly arrowRotation = computed(() => {
    const meta = this.anchorMeta();

    if (this.isExpanded()) return ARROW_ROTATION[meta.expandedArrowDirection];
    if (this.isHidden()) return ARROW_ROTATION[meta.hiddenArrowDirection];

    return ARROW_ROTATION['up'];
  });

  protected readonly arrowStyle = computed(() => ({
    transform: `rotate(${this.arrowRotation()}deg)`,
  }));

  protected readonly headerInfoStyle = computed(() => ({
    flexDirection: this.anchorMeta().headerFlexDirection,
  }));

  protected readonly widthStyle = computed(() => {
    const { size } = this.panel();

    if (this.isHidden() && !this.isHovered()) {
      return `${HIDDEN_PANEL_WIDTH}px`;
    }

    return `${size.width}px`;
  });

  protected readonly heightStyle = computed(() => {
    const { size } = this.panel();

    return this.isExpanded() ? `${size.height}px` : 'auto';
  });

  protected readonly panelStyles = computed(() => {
    const { zIndex } = this.panel();

    return {
      ...this.horizontalPosition(),
      ...this.verticalPosition(),
      width: this.widthStyle(),
      height: this.heightStyle(),
      zIndex,
    };
  });

  protected onMouseEnter(): void {
    if (this.isHidden()) this.isHovered.set(true);
  }

  protected onMouseLeave(): void {
    this.isHovered.set(false);
  }

  protected onHeaderClick(): void {
    const state = this.panel().state;

    if (state === 'hidden' || state === 'collapsed') {
      this.store.expand(this.id());
      this.isHovered.set(false);
      return;
    }

    if (state === 'expanded') {
      this.store.collapse(this.id());
    }
  }

  protected onHideClick(e: PointerEvent): void {
    e.stopPropagation();
    this.store.hide(this.id());
    this.store.resetSize(this.id());
    const anchorPosition = this.anchoringService.getAnchoredPosition(
      this.panel(),
      Object.values(this.store.panels()),
    );
    this.store.updatePosition(this.id(), { x: anchorPosition.x, y: anchorPosition.y });
  }

  protected onSizeChange(rect: Rect): void {
    const meta = this.anchorMeta();

    this.store.updateSize(this.id(), { width: rect.width, height: rect.height });

    const newPosition = meta.centered
      ? { x: rect.x + rect.width / 2, y: rect.y }
      : { x: rect.x, y: rect.y };

    this.store.updatePosition(this.id(), newPosition);
  }
}
