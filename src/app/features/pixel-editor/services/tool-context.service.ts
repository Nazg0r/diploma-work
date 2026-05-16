import { inject, Injectable } from '@angular/core';
import { isPixelLayer } from '../../../core/models/layers';
import { ToolContext } from '../../../core/models/tools/tool-context.model';
import { SpriteLayerStore } from '../../../core/stores/layers';
import { ToolStore } from '../stores/tools/tool.store';
import { Tool } from '../tools/tool';
import { ToolRegistry } from './tool-registry.service';
import { ColorStore } from '../../../core/stores/color/color.store';

@Injectable()
export class ToolContextService {
  private readonly toolStore = inject(ToolStore);
  private readonly toolRegistry = inject(ToolRegistry);
  private readonly layerStore = inject(SpriteLayerStore);
  private readonly colorStore = inject(ColorStore);

  public activeTool(): Tool {
    return this.toolRegistry.getTool(this.toolStore.activeTool());
  }

  public buildContext(): ToolContext | null {
    const layer = this.layerStore.activeLayer();
    if (!layer || !isPixelLayer(layer) || !layer.isVisible || layer.isLocked) return null;

    return {
      layer,
      layerStore: this.layerStore,
      color: this.colorStore.foreground(),
      brushSize: this.toolStore.brushSize(),
      perfectPixel: this.toolStore.perfectPixel(),
      opacity: this.toolStore.opacity(),
    };
  }
}
