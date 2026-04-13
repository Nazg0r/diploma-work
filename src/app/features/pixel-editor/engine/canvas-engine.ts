import { Size, Vector2 } from '../../../core/models/canvas.model';
import { Viewport } from '../../../core/models/viewport.model';
import { DEFAULT_VIEWPORT_CONFIG } from '../constants/viewport.constants';
import { CanvasInputHandler } from './input/canvas-input-handler';
import { RenderLoop } from './render/render-loop';
import { ViewportController } from './viewport/viewport-controller';

export abstract class CanvasEngine {
  protected canvas!: HTMLCanvasElement;
  protected ctx!: CanvasRenderingContext2D;
  protected canvasSize!: Size;
  protected viewportController!: ViewportController;
  private renderLoop!: RenderLoop;
  private inputHandler!: CanvasInputHandler;

  public abstract render(): void;

  public onViewportChange: ((viewport: Viewport) => void) | null = null;

  public mount(canvas: HTMLCanvasElement, canvasSize: Size): void {
    this.canvas = canvas;
    this.canvasSize = canvasSize;
    this.ctx = canvas.getContext('2d', { willReadFrequently: false })!;

    this.fitCanvas();

    this.viewportController = new ViewportController(
      DEFAULT_VIEWPORT_CONFIG,
      () => this.canvasSize,
      () => ({ width: this.canvas.width, height: this.canvas.height }),
    );

    this.viewportController.onChange = (vp) => {
      this.onViewportChange?.(vp);
    };

    this.renderLoop = new RenderLoop(() => this.render());

    this.inputHandler = new CanvasInputHandler(canvas, {
      onZoom: (point, factor) => {
        this.viewportController.zoomAt(point, factor);
        this.renderLoop.markDirty();
      },
      onPan: (delta) => {
        this.viewportController.pan(delta);
        this.renderLoop.markDirty();
      },
    });

    this.viewportController.center();
    this.inputHandler.bind();
    this.renderLoop.markDirty();
  }

  public unMount() {
    this.inputHandler.unbind();
    this.renderLoop.dispose();
  }

  public get viewport(): Readonly<Viewport> {
    return this.viewportController.getViewport();
  }

  public zoomAt(focusPoint: Vector2, factor: number): void {
    this.viewportController.zoomAt(focusPoint, factor);
    this.renderLoop.markDirty();
  }

  public zoomIn(focusPoint?: Vector2): void {
    this.viewportController.zoomIn(focusPoint);
    this.renderLoop.markDirty();
  }

  public zoomOut(focusPoint?: Vector2): void {
    this.viewportController.zoomOut(focusPoint);
    this.renderLoop.markDirty();
  }

  public setZoom(value: number, focusPoint?: Vector2): void {
    this.viewportController.setZoom(value, focusPoint);
    this.renderLoop.markDirty();
  }

  public pan(delta: Vector2): void {
    this.viewportController.pan(delta);
    this.renderLoop.markDirty();
  }

  public setOffset(offset: Vector2): void {
    this.viewportController.setOffset(offset);
    this.renderLoop.markDirty();
  }

  public resetView(): void {
    this.viewportController.resetView();
    this.renderLoop.markDirty();
  }

  public screenToCanvas(screen: Vector2): Vector2 {
    return this.viewportController.screenToCanvas(screen);
  }

  public canvasToScreen(point: Vector2): Vector2 {
    return this.viewportController.canvasToScreen(point);
  }

  public resize(): void {
    this.fitCanvas();
    this.viewportController.center();
    this.renderLoop.markDirty();
  }

  protected markDirty(): void {
    this.renderLoop.markDirty();
  }

  private fitCanvas() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width);
    this.canvas.height = Math.floor(rect.height);
  }
}
