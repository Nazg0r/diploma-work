import { Injectable } from '@angular/core';
import { ToolContext } from '../../../core/models/tools/tool-context.model';
import { hexToRgba } from '../utils/tool.util';
import { BaseBrushTool } from './base-brush.tool';
import { RGBA } from '../../../core/models/palette/color.model';

@Injectable({ providedIn: 'root' })
export class PencilTool extends BaseBrushTool {
  public readonly id = 'pencil' as const;
  public readonly icon = 'pencil';

  protected override getNewColor = (ctx: ToolContext): RGBA => hexToRgba(ctx.color, ctx.opacity);
}
