import { Size, Vector2 } from '../../../../core/models/canvas.model';
import { Viewport } from '../../../../core/models/viewport.model';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../../constants/zoom.constants';

export class ViewportController {
  private viewport: Viewport;

  constructor(
    initialViewport: Viewport,
    private readonly getCanvasSize: () => Size,
    private readonly getViewportSize: () => Size,
  ) {
    this.viewport = initialViewport;
  }

  public onChange: ((viewport: Viewport) => void) | null = null;

  public getViewport(): Readonly<Viewport> {
    return this.viewport;
  }

  private clampOffset(offset: Vector2): Vector2 {
    const { width: cw, height: ch } = this.getCanvasSize();
    const { width: vw, height: vh } = this.getViewportSize();
    const canvasWidth = cw * this.viewport.zoom;
    const canvasHeight = ch * this.viewport.zoom;

    return {
      x: this.clampAxis(offset.x, canvasWidth, vw),
      y: this.clampAxis(offset.y, canvasHeight, vh),
    };
  }

  private clampAxis(offset: number, canvas: number, viewport: number): number {
    if (viewport < canvas) {
      const min = viewport - canvas;
      const max = 0;
      return Math.min(max, Math.max(min, offset));
    }
    const min = 0;
    const max = viewport - canvas;
    return Math.min(max, Math.max(min, offset));
  }

  public screenToCanvas(screen: Vector2): Vector2 {
    return {
      x: Math.floor((screen.x - this.viewport.offset.x) / this.viewport.zoom),
      y: Math.floor((screen.y - this.viewport.offset.y) / this.viewport.zoom),
    };
  }

  public canvasToScreen(point: Vector2): Vector2 {
    return {
      x: point.x * this.viewport.zoom + this.viewport.offset.x,
      y: point.y * this.viewport.zoom + this.viewport.offset.y,
    };
  }

  public zoomAt(focusPoint: Vector2, factor: number): void {
    const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, this.viewport.zoom * factor));
    if (newZoom === this.viewport.zoom) return;

    const canvasPoint = this.screenToCanvas(focusPoint);
    const rawOffset = {
      x: focusPoint.x - canvasPoint.x * newZoom,
      y: focusPoint.y - canvasPoint.y * newZoom,
    };

    this.setViewport({ zoom: newZoom, offset: this.clampOffset(rawOffset) });
  }

  public zoomIn(focusPoint?: Vector2): void {
    this.zoomAt(focusPoint ?? this.getCenter(), ZOOM_STEP);
  }

  public zoomOut(focusPoint?: Vector2): void {
    this.zoomAt(focusPoint ?? this.getCenter(), 1 / ZOOM_STEP);
  }

  public setZoom(value: number, focusPoint?: Vector2): void {
    const zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
    this.zoomAt(focusPoint ?? this.getCenter(), zoom / this.viewport.zoom);
  }

  public pan(delta: Vector2): void {
    this.setOffset({
      x: this.viewport.offset.x + delta.x,
      y: this.viewport.offset.y + delta.y,
    });
  }

  public center(): void {
    const { width, height } = this.getCanvasSize();
    const { width: vpW, height: vpH } = this.getViewportSize();

    const rawOffset = {
      x: Math.round((vpW - width * this.viewport.zoom) / 2),
      y: Math.round((vpH - height * this.viewport.zoom) / 2),
    };
    this.setOffset(rawOffset);
  }

  public resetView(): void {
    this.viewport = { ...this.viewport, zoom: 1 };
    this.center();
  }

  public setOffset(offset: Vector2): void {
    this.setViewport({
      ...this.viewport,
      offset: this.clampOffset(offset),
    });
  }

  private setViewport(viewport: Viewport): void {
    this.viewport = viewport;
    this.onChange?.(this.viewport);
  }

  private getCenter(): Vector2 {
    const { width, height } = this.getViewportSize();
    return { x: width / 2, y: height / 2 };
  }
}
