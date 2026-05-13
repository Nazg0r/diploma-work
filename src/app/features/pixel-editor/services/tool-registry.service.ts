import { inject, Injectable } from '@angular/core';
import { ToolId } from '../../../core/models/tools/tool-context.model';
import { Tool } from '../tools/tool';
import { PencilTool } from '../tools/pencil.tool';
import { EraserTool } from '../tools/eraser.tool';

@Injectable({ providedIn: 'root' })
export class ToolRegistry {
  private readonly pencilTool = inject(PencilTool);
  private readonly eraserTool = inject(EraserTool);

  private readonly tools: Record<ToolId, Tool> = {
    pencil: this.pencilTool,
    eraser: this.eraserTool,
  };

  public getTool(id: ToolId): Tool {
    return this.tools[id];
  }

  public getToolbarTools(): Tool[] {
    return Object.values(this.tools).filter((tool: Tool) => tool.isOnToolbar);
  }
}
