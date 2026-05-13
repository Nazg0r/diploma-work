import { Size } from '../../../../core/models/canvas.model';
import { PixelLayer } from '../../../../core/models/layers';
import { RenderBuffersService } from '../../services/render-buffer.service';

export class PixelLayersRenderer {
  constructor(private readonly buffers: RenderBuffersService) {}

  public render(layers: PixelLayer[], canvasSize: Size): void {
    const ctx = this.buffers.getLayersContext(canvasSize);
    this.buffers.clearLayers();

    for (const layer of layers) {
      if (!layer.isVisible) continue;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      const temp = new OffscreenCanvas(layer.size.width, layer.size.height);
      const tempCtx = temp.getContext('2d')!;
      tempCtx.putImageData(layer.data, 0, 0);

      ctx.drawImage(temp, 0, 0);
      ctx.restore();
    }
  }
}
