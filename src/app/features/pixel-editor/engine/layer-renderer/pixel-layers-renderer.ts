import { LayersRenderer, PixelLayer } from '../../../../core/models/layers';
import { Viewport } from '../../../../core/models/viewport.model';

export class PixelLayersRenderer implements LayersRenderer<PixelLayer> {
  render(ctx: CanvasRenderingContext2D, layers: PixelLayer[], viewport: Viewport) {
    for (const layer of layers) {
      if (!layer.isVisible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      const tempCanvas = new OffscreenCanvas(layer.size.width, layer.size.height);
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx?.putImageData(layer.data, 0, 0);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        tempCanvas,
        viewport.offset.x,
        viewport.offset.y,
        layer.size.width * viewport.zoom,
        layer.size.height * viewport.zoom,
      );

      ctx.restore();
    }
  }
}
