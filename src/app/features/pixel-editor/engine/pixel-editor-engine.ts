import { Injectable } from '@angular/core';
import { Checkerboard } from './checkerboard';
import { Grid } from './grid';
import { CanvasEngine } from './canvas-engine';

@Injectable()
export class PixelEditorEngine extends CanvasEngine {
  private readonly checkerboard = new Checkerboard();
  private readonly grid = new Grid();


  public override render(): void {
    const { ctx, canvas, viewport, canvasSize } = this
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#242225'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sx = viewport.offset.x;
    const sy = viewport.offset.y;
    const sw = canvasSize.width * viewport.zoom;
    const sh = canvasSize.height * viewport.zoom;

    this.checkerboard.render(ctx, sx, sy, sw, sh, viewport.zoom);
    this.grid.render(ctx, viewport, canvasSize);

    ctx.imageSmoothingEnabled = false
  }


}
