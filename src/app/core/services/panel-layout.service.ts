import { effect, inject, Injectable } from '@angular/core';
import { PANEL_EDGE_OFFSET } from '../constants/panel.constatns';
import { Size, Vector2 } from '../models/canvas.model';
import { PanelAnchor, PanelModel } from '../models/panel.model';
import { PanelStore } from '../stores/panels/panel.store';
import { PanelAnchoringService } from './panel-anchoring.service';
import { ViewportService } from './viewport.service';

@Injectable({ providedIn: 'root' })
export class PanelLayoutService {
  private readonly store = inject(PanelStore);
  private readonly viewportService = inject(ViewportService);
  private readonly anchoringService = inject(PanelAnchoringService);

  isInitialized = false;

  constructor() {
    effect(() => {
      this.viewportService.size();

      if (!this.isInitialized) {
        this.isInitialized = true;
        return;
      }

      this.syncAllPanels();
    });
  }

  private syncAllPanels(): void {
    const allPanels = Object.values(this.store.panels());

    allPanels.forEach((panel) => {
      const newPosition = this.calculateNewPosition(panel, allPanels);
      if (newPosition.x !== panel.position.x || newPosition.y !== panel.position.y) {
        this.store.updatePosition(panel.id, newPosition);
      }
    });
  }

  private calculateNewPosition(panel: PanelModel, allPanels: PanelModel[]): Vector2 {
    if (panel.state === 'hidden') {
      return this.anchoringService.getAnchoredPosition(panel, allPanels);
    }
    const { position, size, anchor } = panel;
    return this.clampToViewport(position, anchor, size);
  }

  public clampToViewport(position: Vector2, anchor: PanelAnchor, size: Size): Vector2 {
    const { width: vw, height: vh } = this.viewportService.size();

    if (anchor === 'bottom') {
      const halfWidth = size.width / 2;
      return {
        x: Math.min(
          vw - halfWidth - PANEL_EDGE_OFFSET,
          Math.max(halfWidth + PANEL_EDGE_OFFSET, position.x),
        ),
        y: Math.min(vh - size.height - PANEL_EDGE_OFFSET, Math.max(PANEL_EDGE_OFFSET, position.y)),
      };
    }

    return {
      x: Math.min(vw - size.width - PANEL_EDGE_OFFSET, Math.max(PANEL_EDGE_OFFSET, position.x)),
      y: Math.min(vh - size.height - PANEL_EDGE_OFFSET, Math.max(PANEL_EDGE_OFFSET, position.y)),
    };
  }
}
