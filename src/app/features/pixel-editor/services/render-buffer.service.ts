import { computed, Injectable, signal } from '@angular/core';
import { Size } from '../../../core/models/canvas.model';

@Injectable({ providedIn: 'root' })
export class RenderBuffersService {
  private layers: OffscreenCanvas | null = null;
  private preview: OffscreenCanvas | null = null;

  public getLayersContext(size: Size): OffscreenCanvasRenderingContext2D {
    this.layers = this.ensure(this.layers, size);
    const ctx = this.layers.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  public getLayersCanvas(): OffscreenCanvas | null {
    return this.layers;
  }

  public getPreviewContext(size: Size): OffscreenCanvasRenderingContext2D {
    this.preview = this.ensure(this.preview, size);
    const ctx = this.preview.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  public getPreviewCanvas(): OffscreenCanvas | null {
    return this.preview;
  }

  public clearLayers(): void {
    if (!this.layers) return;
    const ctx = this.layers.getContext('2d')!;
    ctx.clearRect(0, 0, this.layers.width, this.layers.height);
  }

  public clearPreview(): void {
    if (!this.preview) return;
    const ctx = this.preview.getContext('2d')!;
    ctx.clearRect(0, 0, this.preview.width, this.preview.height);
  }

  public compositePreviewOntoLayers(composite?: GlobalCompositeOperation): void {
    if (!this.layers || !this.preview) return;

    const ctx = this.layers.getContext('2d')!;
    ctx.save();
    if (composite) {
      ctx.globalCompositeOperation = composite;
    }
    ctx.drawImage(this.preview, 0, 0);
    ctx.restore();
  }

  public drawLayersToScreen(
    targetCtx: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ): void {
    if (!this.layers) return;
    targetCtx.save();
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.drawImage(this.layers, sx, sy, sw, sh);
    targetCtx.restore();
  }


  private ensure(buffer: OffscreenCanvas | null, size: Size): OffscreenCanvas {
    if (!buffer || buffer.width !== size.width || buffer.height !== size.height) {
      return new OffscreenCanvas(size.width, size.height);
    }
    return buffer;
  }
}
