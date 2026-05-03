import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { MAX_THUMBNAIL_SIZE } from '../constants/layers.constants';
import { Size } from '../models/canvas.model';
import { isPixelLayer, Layer, PixelLayer } from '../models/layers';
import { LAYER_STORE } from '../stores/layers';
import { HistoryManagerService } from './history-manager.service';

@Injectable()
export class ThumbnailService {
  private readonly store = inject(LAYER_STORE);
  private readonly history = inject(HistoryManagerService);

  private readonly _cache = signal<Map<string, string>>(new Map());
  public readonly cache = this._cache.asReadonly();

  constructor() {
    effect(() => {
      const layers = this.store.layers();
      untracked(() => this.updateCache(Object.values(layers)));
    });

    effect(() => {
      const cmdInfo = this.history.lastCommand();
      if (!cmdInfo) return;

      untracked(() => {
        const affected = cmdInfo.command.affectedLayerIds?.() ?? [];
        if (affected.length === 0) return;

        for (const layerId of affected) {
          this.regenerateOne(layerId);
        }
      });
    });
  }

  public getThumbnail(layerId: string): string | null {
    return this._cache().get(layerId) ?? null;
  }

  private updateCache(layers: Layer[]): void {
    const cache = this._cache();
    const toGenerate = layers.filter((l) => !cache.has(l.id));
    if (toGenerate.length === 0) return;

    const updatedCache = new Map(cache);
    for (const layer of toGenerate) {
      const dataUrl = this.generateForLayer(layer);
      if (dataUrl) updatedCache.set(layer.id, dataUrl);
    }
    this._cache.set(updatedCache);
  }

  private regenerateOne(layerId: string): void {
    const layer = this.store.getLayer(layerId);
    const updatedCache = new Map(this._cache());

    if (!layer) {
      updatedCache.delete(layerId);
    } else {
      const dataUrl = this.generateForLayer(layer);
      if (dataUrl) {
        updatedCache.set(layerId, dataUrl);
      } else {
        updatedCache.delete(layerId);
      }
    }

    this._cache.set(updatedCache);
  }

  private generateForLayer(layer: Layer): string | null {
    if (isPixelLayer(layer)) return this.generatePixelThumbnail(layer);
    return null;
  }

  private generatePixelThumbnail(layer: PixelLayer): string | null {
    const { width: thumbWidth, height: thumbHeight } = this.calculateDimensions(layer.size);

    try {
      const sourceCanvas = new OffscreenCanvas(layer.size.width, layer.size.height);
      const sourceCtx = sourceCanvas.getContext('2d');
      if (!sourceCtx) return null;
      sourceCtx.putImageData(layer.data, 0, 0);

      const thumbCanvas = new OffscreenCanvas(thumbWidth, thumbHeight);
      const thumbCtx = thumbCanvas.getContext('2d');
      if (!thumbCtx) return null;

      thumbCtx.imageSmoothingEnabled = false;
      thumbCtx.drawImage(sourceCanvas, 0, 0, thumbWidth, thumbHeight);

      return this.canvasToDataUrl(thumbCanvas);
    } catch (e) {
      console.warn('Thumbnail generation failed', e);
      return null;
    }
  }

  private calculateDimensions(size: Size): Size {
    const longest = Math.max(size.width, size.height);
    const scale = MAX_THUMBNAIL_SIZE / longest;

    return {
      width: Math.max(1, Math.round(size.width * scale)),
      height: Math.max(1, Math.round(size.height * scale)),
    };
  }

  private canvasToDataUrl(canvas: OffscreenCanvas): string | null {
    const bitmap = canvas.transferToImageBitmap();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = bitmap.width;
    tempCanvas.height = bitmap.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(bitmap, 0, 0);
    return tempCanvas.toDataURL('image/png');
  }
}
