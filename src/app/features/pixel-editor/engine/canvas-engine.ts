import { Size, Vector2 } from '../../../core/models/canvas.model';
import { Viewport } from '../../../core/models/viewport.model';

export abstract class CanvasEngine {
  MIN_SCALE = 0.25;
  MAX_SCALE = 64;
  ZOOM_STEP = 1.25;

  protected canvas!: HTMLCanvasElement;
  protected ctx!: CanvasRenderingContext2D;

  protected viewport!: Viewport;

  protected initialViewport: Viewport = {
    offset: { x: 0, y: 0 },
    zoom: 1,
  };

  // Default
  protected canvasSize: Size = {
    width: 128,
    height: 128,
  };

  private isDirty = false;
  private isPanning: boolean = false;
  private isSpacePressed = false;
  private frameId: number | null = null;
  private lastPanPoint: Vector2 = { x: 0, y: 0 };
  // start

  public mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    // question about this
    this.ctx = canvas.getContext('2d', { willReadFrequently: false })!;
    this.viewport = this.initialViewport;

    this.fitCanvas();
    this.centerCanvas();
    this.bindEvents();
    this.markDirty();
  }

  public unMount() {
    this.unbindEvents();
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  // helper commands

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

  public isOnCanvas(point: Vector2): boolean {
    return (
      point.x > 0 && point.y > 0 && point.x < this.canvas.width && point.y < this.canvas.height
    );
  }

  private getCanvasCenter(): Vector2 {
    return {
      x: this.canvasSize.width / 2,
      y: this.canvasSize.height / 2,
    };
  }

  private fitCanvas() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width);
    this.canvas.height = Math.floor(rect.height);
  }

  private centerCanvas() {
    const { width, height } = this.canvasSize;
    this.viewport = {
      ...this.viewport,
      offset: {
        x: Math.round((this.canvas.width - width * this.viewport.zoom) / 2),
        y: Math.round((this.canvas.height - height * this.viewport.zoom) / 2),
      },
    };
  }

  // Zoom

  public zoomAt(focusPoint: Vector2, factor: number) {
    const rawZoom = this.viewport.zoom * factor;
    const newZoom = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, rawZoom));

    if (newZoom === this.viewport.zoom) return;

    const canvasPoint = this.screenToCanvas(focusPoint);

    this.viewport = {
      offset: {
        x: focusPoint.x - canvasPoint.x * newZoom,
        y: focusPoint.y - canvasPoint.y * newZoom,
      },
      zoom: newZoom,
    };

    this.markDirty();
  }

  public zoomIn(focusPoint: Vector2) {
    this.zoomAt(focusPoint ?? this.getCanvasCenter(), this.ZOOM_STEP);
  }

  public zoomOut(focusPoint: Vector2) {
    this.zoomAt(focusPoint ?? this.getCanvasCenter(), 1 / this.ZOOM_STEP);
  }

  public setZoom(value: number, focusPoint?: Vector2) {
    const zoom = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, value));
    this.zoomAt(focusPoint ?? this.getCanvasCenter(), zoom / this.viewport.zoom);
  }

  public resetView() {
    this.viewport = {
      ...this.viewport,
      zoom: 1,
    };
    this.centerCanvas();
    this.markDirty();
  }

  // Pan

  public pan(delta: Vector2) {
    this.viewport = {
      ...this.viewport,
      offset: {
        x: this.viewport.offset.x + delta.x,
        y: this.viewport.offset.y + delta.y,
      },
    };
    this.markDirty();
  }

  protected markDirty() {
    if (this.isDirty) return;
    this.isDirty = true;
    this.frameId = window.requestAnimationFrame(() => {
      this.isDirty = false;
      this.frameId = null;
      this.render();
    });
  }

  public abstract render(): void;

  private readonly onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      this.pan({ x: -e.deltaX, y: -e.deltaY });
    } else if (e.shiftKey) {
      this.pan({ x: -e.deltaY, y: -e.deltaX });
    } else {
      const factor = e.deltaY < 0 ? this.ZOOM_STEP : 1 / this.ZOOM_STEP;
      this.zoomAt({ x: e.offsetX, y: e.offsetY }, factor);
    }
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    const isMiddleButton = e.button === 1;
    const isSpaceDrag = e.button === 0 && this.isSpacePressed;
    console.log(this.isSpacePressed)

    if (isMiddleButton || isSpaceDrag) {
      this.isPanning = true;
      this.lastPanPoint = { x: e.clientX, y: e.clientY };
      this.canvas.setPointerCapture(e.pointerId);
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
    }
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (!this.isPanning) return;

    const delta = {
      x: e.clientX - this.lastPanPoint.x,
      y: e.clientY - this.lastPanPoint.y,
    };
    this.lastPanPoint = {
      x: e.offsetX,
      y: e.offsetY,
    };

    this.pan(delta);
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (!this.isPanning) return;

    this.isPanning = false;
    this.canvas.releasePointerCapture(e.pointerId);
    this.canvas.style.cursor = this.isSpacePressed ? 'grab' : '';
  };

  private readonly onPaddingKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' && !e.repeat) {
      this.isSpacePressed = true;
      if (!this.isPanning) this.canvas.style.cursor = 'grab';
      e.preventDefault();
    }
  };

  private readonly onPaddingKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this.isSpacePressed = false;
      if (!this.isPanning) this.canvas.style.cursor = '';
    }
  };

  private bindEvents(): void {
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('keydown', this.onPaddingKeyDown);
    window.addEventListener('keyup', this.onPaddingKeyUp);
  }

  private unbindEvents(): void {
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('keydown', this.onPaddingKeyDown);
    window.removeEventListener('keyup', this.onPaddingKeyUp);
  }
}
