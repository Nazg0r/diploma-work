import { Vector2 } from '../../../../core/models/canvas.model';
import { ToolContext } from '../../../../core/models/tools/tool-context.model';
import { ToolContextService } from '../../services/tool-context.service';
import { Tool } from '../../tools/tool';
import { RenderLoop } from '../engine-renderer/render-loop';
import { ViewportController } from '../viewport/viewport-controller';

export class ToolsInputHandlers {
  constructor(
    private readonly viewportController: ViewportController,
    private readonly renderer: RenderLoop,
    private readonly toolContext: ToolContextService,
  ) {}

  private setToolState(
    screenPoint: Vector2,
    action: (tool: Tool, point: Vector2, ctx: ToolContext) => boolean,
  ): void {
    const ctx = this.toolContext.buildContext();
    if (!ctx) return;

    const tool = this.toolContext.activeTool();
    const canvasPoint = this.viewportController.screenToCanvas(screenPoint);

    if (action(tool, canvasPoint, ctx)) {
      this.renderer.markDirty();
    }
  }
  public handleToolPointerDown(screenPoint: Vector2): void {
    this.setToolState(screenPoint, (tool, point, ctx) => {
      if (this.viewportController.isInsideCanvas(point)) {
        tool.onStrokeStart(point, ctx);
        return true;
      }
      return false;
    });
  }

  public handleToolPointerMove(screenPoint: Vector2): void {
    this.setToolState(screenPoint, (tool, point, ctx) => {
      tool.onStrokeMove(point, ctx);
      return true;
    });
  }

  public handleToolPointerUp(screenPoint: Vector2): void {
    this.setToolState(screenPoint, (tool, point, ctx) => {
      tool.onStrokeEnd(point, ctx);
      return true;
    });
  }

  public handleToolPointerCancel(): void {
    const tool = this.toolContext.activeTool();
    tool.onStrokeCancel();
    this.renderer.markDirty();
  }
}
