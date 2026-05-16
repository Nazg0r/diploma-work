import { computed, Directive, inject, input } from '@angular/core';
import { PanelId } from '../../../core/models/panel.model';
import { PanelStore } from '../../../core/stores/panels/panel.store';
import { PanelAnchoringService } from '../../../core/services/panel-anchoring.service';
import { PanelLayoutService } from '../../../core/services/panel-layout.service';
import { ViewportService } from '../../../core/services/viewport.service';
import { ANCHOR_META } from '../../../core/models/anchor.model';
import { Rect, Vector2 } from '../../../core/models/canvas.model';

@Directive()
export abstract class PanelBaseDirective {
  public readonly id = input.required<PanelId>({ alias: 'panelId' });

  protected readonly store = inject(PanelStore);
  protected readonly anchoringService = inject(PanelAnchoringService);
  protected readonly panelLayoutService = inject(PanelLayoutService);
  protected readonly viewportService = inject(ViewportService);

  protected readonly panel = computed(() => this.store.panels()[this.id()]);
  protected readonly anchorMeta = computed(() => ANCHOR_META[this.panel().anchor]);

  protected readonly horizontalPosition = computed(() => {
    const { position, size } = this.panel();
    const meta = this.anchorMeta();
    const transform = meta.centered ? 'translateX(-50%)' : 'none';

    if (meta.positioning === 'top-right') {
      return {
        right: `${this.viewportService.width() - position.x - size.width}px`,
        left: 'auto',
        transform,
      };
    }
    return { left: `${position.x}px`, right: 'auto', transform };
  });

  protected readonly verticalPosition = computed(() => {
    const { position, size } = this.panel();
    const meta = this.anchorMeta();

    if (meta.positioning === 'bottom-center') {
      return {
        bottom: `${this.viewportService.height() - position.y - size.height}px`,
        top: 'auto',
      };
    }
    return { top: `${position.y}px`, bottom: 'auto' };
  });

  protected readonly hideButtonStyle = computed(() => {
    const isLeftAligned = this.anchorMeta().positioning === 'top-left';
    return {
      left: isLeftAligned ? 0 : 'auto',
      right: isLeftAligned ? 'auto' : 0,
      transform: isLeftAligned ? 'rotate(180deg)' : 'none',
    };
  });

  protected onPositionChange(position: Vector2): void {
    const { anchor, size } = this.panel();
    const clamped = this.panelLayoutService.clampToViewport(position, anchor, size);
    this.store.updatePosition(this.id(), clamped);
  }

  protected onPointerDown(): void {
    this.store.bringToForward(this.id());
  }

  protected resetPositionToAnchor(): void {
    // this.store.resetSize(this.id());
    const anchorPos = this.anchoringService.getAnchoredPosition(
      this.panel(),
      Object.values(this.store.panels()),
    );
    this.store.updatePosition(this.id(), { x: anchorPos.x, y: anchorPos.y });
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
