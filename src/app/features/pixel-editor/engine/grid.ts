import { Viewport } from '../../../core/models/viewport.model';
import { Size } from '../../../core/models/canvas.model';
import { DEFAULT_GRID_CONFIG } from '../constants/grid.constants';

export interface GridConfig {
  readonly color: string;
  readonly width: number;
  readonly size: number;
  readonly isEnable: boolean;
  readonly minZoom: number;
  readonly opacity: number;
}

export class Grid {
  public config = {...DEFAULT_GRID_CONFIG};

  public render(
    ctx: CanvasRenderingContext2D,
    viewport: Viewport,
    canvasSize: Size
  ) : void {
    if (!this.config.isEnable) return;
    if (viewport.zoom < this.config.minZoom) return;

    const {width, height} = canvasSize;
    const {offset, zoom} = viewport;

    ctx.save();
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = this.config.width;
    ctx.globalAlpha = this.config.opacity;

    ctx.beginPath();

    for (let x = 0; x < width; x += this.config.size) {
      const sx = Math.round(offset.x + x * zoom) + 0.5
      ctx.moveTo(sx, offset.y)
      ctx.lineTo(sx, offset.y + height * zoom)
    }

    for (let y = 0; y < height; y += this.config.size) {
      const sy = Math.round(offset.y + y * zoom) + 0.5
      ctx.moveTo(offset.x, sy)
      ctx.lineTo(offset.x + width * zoom, sy)
    }

    ctx.stroke()
    ctx.restore()
  }
}
