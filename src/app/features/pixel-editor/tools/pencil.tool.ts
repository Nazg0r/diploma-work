import { Injectable } from '@angular/core';
import { RGBA } from '../../../core/models/pixel-change.model';
import { ToolContext } from '../../../core/models/tools/tool-context.model';
import { hexToRgba } from '../utils/tool.util';
import { BaseBrushTool } from './base-brush.tool';

@Injectable({ providedIn: 'root' })
export class PencilTool extends BaseBrushTool {
  public readonly id = 'pencil' as const;
  public readonly icon = 'pencil';

  protected override getNewColor = (ctx: ToolContext): RGBA => hexToRgba(ctx.color, ctx.opacity);
}
