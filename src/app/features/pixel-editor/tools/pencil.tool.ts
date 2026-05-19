import { Injectable } from '@angular/core';
import { RGBA } from '../../../core/models/palette/color.model';
import { ToolContext } from '../../../core/models/tools/tool-context.model';
import { hexToRgba } from '../utils/color.util';
import { BaseBrushTool } from './base-brush.tool';

@Injectable({ providedIn: 'root' })
export class PencilTool extends BaseBrushTool {
  public readonly id = 'pencil' as const;
  public readonly icon = 'pencil';

  protected override getNewColor = (ctx: ToolContext): RGBA => hexToRgba(this.prepareHex(ctx));

  private prepareHex(ctx: ToolContext) {
    return ctx.color + (ctx.opacity * 255).toString(16);
  }
}
