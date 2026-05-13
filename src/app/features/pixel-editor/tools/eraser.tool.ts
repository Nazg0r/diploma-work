import { Injectable } from '@angular/core';
import { ToolContext } from '../../../core/models/tools/tool-context.model';
import { BaseBrushTool } from './base-brush.tool';

@Injectable({ providedIn: 'root' })
export class EraserTool extends BaseBrushTool {
  public readonly id = 'eraser' as const;
  public readonly icon = 'eraser';
  public override readonly previewComposite: GlobalCompositeOperation = 'destination-out';

  protected override usePerfectPixel = (): boolean => false;

  public override renderPreview(ctx: CanvasRenderingContext2D, _toolCtx: ToolContext): void {
    if (this.previewChanges.size === 0) return;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    for (const change of this.previewChanges.values()) {
      ctx.fillRect(change.x, change.y, 1, 1);
    }
  }
}
