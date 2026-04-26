import { inject, Injectable, signal } from '@angular/core';
import { Vector2 } from '../models/canvas.model';
import { PanelAnchor, PanelModel } from '../models/panel.model';
import { ViewportService } from './viewport.service';
import {
  HORIZONTAL_PANEL_GAP,
  PANEL_EDGE_OFFSET,
  PANEL_VERTICAL_START_Y,
  VERTICAL_PANEL_GAP,
} from '../constants/panel.constatns';
import { ANCHOR_META, AnchorPositioning } from '../models/anchor.model';



@Injectable({ providedIn: 'root' })
export class PanelAnchoringService {
  private readonly viewportService = inject(ViewportService);

  private readonly anchorStrategies: Record<
    AnchorPositioning,
    (panel: PanelModel, panels: PanelModel[], order: number) => Vector2
  > = {
    'top-right': (p, panels, order) => this.calculateTopRight(p, panels, order),
    'top-left': (p, panels, order) => this.calculateTopLeft(p, panels, order),
    'bottom-center': (p, panels, order) => this.calculateBottomCenter(p, panels, order),
  };

  public getAnchoredPosition(targetPanel: PanelModel, allPanels: PanelModel[]): Vector2 {
    const meta = ANCHOR_META[targetPanel.anchor];
    const sameAnchorPanels = allPanels.filter((p) => p.anchor === targetPanel.anchor);
    const order = sameAnchorPanels.findIndex((p) => p.id === targetPanel.id);
    return this.anchorStrategies[meta.positioning](targetPanel, sameAnchorPanels, order);
  }

  private calculateTopRight(panel: PanelModel, siblings: PanelModel[], order: number): Vector2 {
    const offsetY = this.getVerticalOffset(siblings, order);
    return {
      x: this.viewportService.width() - panel.size.width - PANEL_EDGE_OFFSET,
      y: PANEL_VERTICAL_START_Y + offsetY,
    };
  }

  private calculateTopLeft(panel: PanelModel, siblings: PanelModel[], order: number): Vector2 {
    const offsetY = this.getVerticalOffset(siblings, order);
    return {
      x: PANEL_EDGE_OFFSET,
      y: PANEL_VERTICAL_START_Y + offsetY,
    };
  }

  private calculateBottomCenter(panel: PanelModel, siblings: PanelModel[], order: number): Vector2 {
    const totalWidth =
      siblings.reduce((sum, p) => sum + p.size.width, 0) +
      Math.max(0, siblings.length - 1) * HORIZONTAL_PANEL_GAP;

    const startX = (this.viewportService.width() - totalWidth) / 2;
    const offsetX = this.getHorizontalOffset(siblings, order);

    return {
      x: startX + offsetX + panel.size.width / 2,
      y: this.viewportService.height() - panel.size.height - PANEL_EDGE_OFFSET,
    };
  }

  private getVerticalOffset(siblings: PanelModel[], order: number): number {
    let offset = 0;
    for (let i = 0; i < order; i++) {
      offset += siblings[i].size.height + VERTICAL_PANEL_GAP;
    }
    return offset;
  }

  private getHorizontalOffset(siblings: PanelModel[], order: number): number {
    let offset = 0;
    for (let i = 0; i < order; i++) {
      offset += siblings[i].size.width + HORIZONTAL_PANEL_GAP;
    }
    return offset;
  }
}
