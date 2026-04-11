export class Checkerboard {
  private pattern: CanvasPattern | null = null;
  private CELL_SIZE: number = 8;

  public render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    zoom: number,
  ) {
    if (!this.pattern) this.buildPattern(ctx);

    const matrix = new DOMMatrix().translate(x, y).scale(zoom);
    this.pattern!.setTransform(matrix);

    ctx.save();
    ctx.fillStyle = this.pattern!;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  private buildPattern(ctx: CanvasRenderingContext2D) {
    const size = this.CELL_SIZE * 2;
    const offscreenCanvas = new OffscreenCanvas(size, size);
    const offCtx = offscreenCanvas.getContext('2d')!;

    offCtx.fillStyle = '#f0f0f0';
    offCtx.fillRect(0, 0, size, size);
    offCtx.fillStyle = '#c8c8c8';
    offCtx.fillRect(0, 0, this.CELL_SIZE, this.CELL_SIZE);
    offCtx.fillRect(this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);

    this.pattern = ctx.createPattern(offscreenCanvas, 'repeat');
  }
}
