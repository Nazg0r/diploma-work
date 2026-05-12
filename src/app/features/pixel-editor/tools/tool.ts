import { ToolContext, ToolId } from '../../../core/models/tools/tool-context.model';
import { Vector2 } from '../../../core/models/canvas.model';

export interface Tool {
  readonly id: ToolId;
  readonly cursor: string;
  readonly icon: string;
  readonly isOnToolbar: boolean;
  readonly previewComposite?: GlobalCompositeOperation;

  onStrokeStart(point: Vector2, context: ToolContext): void;
  onStrokeMove(point: Vector2, context: ToolContext): void;
  onStrokeEnd(point: Vector2, context: ToolContext): void;
  onStrokeCancel(): void;
  renderPreview(ctx: CanvasRenderingContext2D, context: ToolContext): void;
}
