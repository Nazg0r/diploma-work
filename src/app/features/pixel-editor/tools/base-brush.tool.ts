import { inject } from '@angular/core';
import { PaintPixelsCommand } from '../../../core/commands/tools/paint-pixels.command';
import { Size, Vector2 } from '../../../core/models/canvas.model';
import { PixelChange, RGBA } from '../../../core/models/pixel-change.model';
import { ToolContext, ToolId } from '../../../core/models/tools/tool-context.model';
import { HistoryManagerService } from '../../../core/services/history-manager.service';
import { applyPerfectPixel, bresenhamLine, getBrushPoints } from '../utils/tool.util';
import { Tool } from './tool';

export abstract class BaseBrushTool implements Tool {
  abstract readonly id: ToolId;
  abstract readonly icon: string;
  readonly cursor = 'crosshair';
  readonly isOnToolbar = true;
  readonly previewComposite?: GlobalCompositeOperation;

  protected readonly history = inject(HistoryManagerService);

  private isStroke = false;
  private lastPoint: Vector2 | null = null;
  private strokePoints: Vector2[] = [];
  protected previewChanges = new Map<string, PixelChange>();

  protected getNewColor = (ctx: ToolContext): RGBA => [0, 0, 0, 0];
  protected usePerfectPixel = (ctx: ToolContext): boolean => ctx.perfectPixel;

  public onStrokeStart(point: Vector2, ctx: ToolContext): void {
    this.isStroke = true;
    this.lastPoint = point;
    this.strokePoints = [point];
    this.previewChanges.clear();
    this.applyBrushAt(point, ctx);
  }

  public onStrokeMove(point: Vector2, ctx: ToolContext): void {
    if (!this.isStroke || !this.lastPoint) return;

    const linePoints = bresenhamLine(this.lastPoint, point);

    if (this.usePerfectPixel(ctx)) {
    console.log(this.usePerfectPixel(ctx));
      this.strokePoints.push(...linePoints.slice(1));
      const corrected = applyPerfectPixel(this.strokePoints);
      this.previewChanges.clear();
      for (const p of corrected) this.applyBrushAt(p, ctx);
    } else {
      for (const p of linePoints.slice(1)) this.applyBrushAt(p, ctx);
    }

    this.lastPoint = point;
  }

  public onStrokeEnd(_point: Vector2, ctx: ToolContext): void {
    if (!this.isStroke) return;

    if (this.previewChanges.size > 0) {
      this.history.execute(
        new PaintPixelsCommand(ctx.layerStore, ctx.layer.id, new Map(this.previewChanges), this.id),
      );
    }
    this.resetStroke();
  }

  public onStrokeCancel(): void {
    this.resetStroke();
  }

  public renderPreview(ctx: CanvasRenderingContext2D, _toolCtx: ToolContext): void {
    if (this.previewChanges.size === 0) return;

    for (const change of this.previewChanges.values()) {
      const [r, g, b, a] = change.newColor;
      ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
      ctx.fillRect(change.x, change.y, 1, 1);
    }
  }

  private applyBrushAt(center: Vector2, ctx: ToolContext): void {
    const newColor = this.getNewColor(ctx);
    const points = getBrushPoints(center, ctx.brushSize);
    const width = ctx.layer.size.width;
    const data = ctx.layer.data.data;

    for (const point of points) {
      if (this.isOutOfLayer(point, ctx.layer.size)) continue;
      const oldColor = this.getPixelColor(point, width, data);
      this.upsertPreviewPixel(point, oldColor, newColor);
    }
  }

  private resetStroke(): void {
    this.isStroke = false;
    this.lastPoint = null;
    this.strokePoints = [];
    this.previewChanges.clear();
  }

  private isOutOfLayer(point: Vector2, layerSize: Size) {
    const { width, height } = layerSize;
    return point.x < 0 || point.x >= width || point.y < 0 || point.y >= height;
  }

  private getPixelColor(point: Vector2, width: number, data: Uint8ClampedArray): RGBA {
    const i = (point.y * width + point.x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }

  private upsertPreviewPixel(point: Vector2, oldColor: RGBA, newColor: RGBA): void {
    const key = `${point.x},${point.y}`;

    const existing = this.previewChanges.get(key);

    if (existing) {
      existing.newColor = newColor;
      return;
    }

    this.previewChanges.set(key, {
      x: point.x,
      y: point.y,
      oldColor,
      newColor,
    });
  }
}
