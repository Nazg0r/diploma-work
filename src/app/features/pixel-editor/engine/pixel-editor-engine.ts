import { AfterViewInit, effect, inject, Injectable } from '@angular/core';
import { SpriteLayerStore } from '../../../core/stores/layers/sprite-layer.store';
import { CanvasEngine } from './canvas-engine';
import { Checkerboard } from './checkerboard';
import { Grid, GridConfig } from './grid';
import { PixelLayersRenderer } from './layer-renderer/pixel-layers-renderer';

@Injectable()
export class PixelEditorEngine extends CanvasEngine implements AfterViewInit {
  private readonly layerStore = inject(SpriteLayerStore);
  private readonly layerRenderer = new PixelLayersRenderer();
  private readonly checkerboard = new Checkerboard();
  private readonly grid = new Grid();

  ngAfterViewInit(): void {
    effect(() => {
      this.layerStore.layers();
      this.layerStore.rootChildren();
      this.markDirty();
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

    this.checkerboard.render(ctx, sx, sy, sw, sh, viewport.zoom);
    const orderedLayers = this.layerStore.layersInRenderOrder();
    this.layerRenderer.render(ctx, orderedLayers, viewport);
    this.grid.render(ctx, viewport, canvasSize);

    ctx.imageSmoothingEnabled = false;
  }

  public changeGridConfig(conf: Partial<GridConfig>): void {
    this.grid.config = { ...this.grid.config, ...conf };
    this.markDirty();
  }
}
