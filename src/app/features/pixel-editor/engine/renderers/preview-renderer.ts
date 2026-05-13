import { ToolContextService } from '../../services/tool-context.service';
import { RenderBuffersService } from '../../services/render-buffer.service';


export class PreviewRenderer {
  constructor(
    private readonly toolContext: ToolContextService,
    private readonly buffers: RenderBuffersService,
  ) {}

  public render(): void {
    const toolCtx = this.toolContext.buildContext();
    if (!toolCtx) return;

    const tool = this.toolContext.activeTool();
    const layerSize = toolCtx.layer.size;

    const previewCtx = this.buffers.getPreviewContext(layerSize);
    this.buffers.clearPreview();

    tool.renderPreview(previewCtx as unknown as CanvasRenderingContext2D, toolCtx);
    this.buffers.compositePreviewOntoLayers(tool.previewComposite);
  }
}
