import { effect, inject, Injectable } from '@angular/core';
import { CanvasInputHandlerOptions } from '../../../core/models/canvas.model';
import { isPixelLayer } from '../../../core/models/layers';
import { SpriteLayerStore } from '../../../core/stores/layers';
import { RenderBuffersService } from '../services/render-buffer.service';
import { ToolContextService } from '../services/tool-context.service';
import { CanvasEngine } from './canvas-engine';
import { Checkerboard } from './checkerboard';
import { Grid, GridConfig } from './grid';
import { ToolsInputHandlers } from './input/tools-input.handlers';
import { PixelLayersRenderer } from './renderers/pixel-layers-renderer';
import { PreviewRenderer } from './renderers/preview-renderer';

@Injectable()
export class PixelEditorEngine extends CanvasEngine {
  private readonly layerStore = inject(SpriteLayerStore);
  private readonly toolContextService = inject(ToolContextService);
  private readonly buffers = inject(RenderBuffersService);
  private readonly layerRenderer: PixelLayersRenderer;
  private readonly previewRenderer: PreviewRenderer;
  private readonly checkerboard = new Checkerboard();
  private readonly grid = new Grid();
  private toolsInputHandler!: ToolsInputHandlers;

  constructor() {
    super();
    this.layerRenderer = new PixelLayersRenderer(this.buffers);
    this.previewRenderer = new PreviewRenderer(this.toolContextService, this.buffers);

    effect(() => {
      this.layerStore.layers();
      this.layerStore.rootChildren();
      this.renderLoop.markDirty();
    });
  }

  public override render(): void {
    const { ctx, canvas, viewport, canvasSize } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#242225';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sx = viewport.offset.x;
    const sy = viewport.offset.y;
    const sw = canvasSize.width * viewport.zoom;
    const sh = canvasSize.height * viewport.zoom;

    const orderedLayers = this.layerStore.layersInRenderOrder();
    if (!orderedLayers.every((layer) => isPixelLayer(layer))) return;

    this.checkerboard.render(ctx, sx, sy, sw, sh, viewport.zoom);
    this.layerRenderer.render(orderedLayers, canvasSize);
    this.previewRenderer.render();
    this.buffers.drawLayersToScreen(ctx, sx, sy, sw, sh);
    this.grid.render(ctx, viewport, canvasSize);

    ctx.imageSmoothingEnabled = false;
  }

  public changeGridConfig(conf: Partial<GridConfig>): void {
    this.grid.config = { ...this.grid.config, ...conf };
    this.renderLoop.markDirty();
  }

  protected override buildInputOptions(base: CanvasInputHandlerOptions): CanvasInputHandlerOptions {
    if (!this.toolsInputHandler) {
      this.toolsInputHandler = new ToolsInputHandlers(
        this.viewportController,
        this.renderLoop,
        this.toolContextService,
      );
    }

    return {
      ...base,
      onToolPointerDown: (p) => this.toolsInputHandler.handleToolPointerDown(p),
      onToolPointerMove: (p) => this.toolsInputHandler.handleToolPointerMove(p),
      onToolPointerUp: (p) => this.toolsInputHandler.handleToolPointerUp(p),
      onToolPointerCancel: () => this.toolsInputHandler.handleToolPointerCancel(),
    };
  }
}
