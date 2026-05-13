import { CanvasInputHandlerOptions, Vector2 } from '../../../../core/models/canvas.model';
import { ZOOM_STEP } from '../../constants/zoom.constants';

export class CanvasInputHandler {
  private isPanning: boolean = false;
  private isSpacePressed = false;
  private isStrokeActive = false;
  private lastPanPoint: Vector2 = { x: 0, y: 0 };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: CanvasInputHandlerOptions,
  ) {}

  public bind(): void {
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerCancel);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  public unbind(): void {
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private readonly onWheel = (e: WheelEvent): void => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      this.options.onPan({ x: -e.deltaX, y: -e.deltaY });
    } else if (e.shiftKey) {
      this.options.onPan({ x: -e.deltaY, y: -e.deltaX });
    } else {
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      this.options.onZoom({ x: e.offsetX, y: e.offsetY }, factor);
    }
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    const isMiddle = e.button === 1;
    const isSpaceDrag = e.button === 0 && this.isSpacePressed;
    const isLeftClick = e.button === 0 && !this.isSpacePressed;

    if (isMiddle || isSpaceDrag) {
      this.isPanning = true;
      this.lastPanPoint = { x: e.clientX, y: e.clientY };
      this.canvas.setPointerCapture(e.pointerId);
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
    }

    if (isLeftClick) {
      this.isStrokeActive = true;
      this.canvas.setPointerCapture(e.pointerId);
      this.options.onToolPointerDown?.({ x: e.offsetX, y: e.offsetY });
      e.preventDefault();
    }
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (this.isPanning) {
      this.options.onPan({
        x: e.clientX - this.lastPanPoint.x,
        y: e.clientY - this.lastPanPoint.y,
      });
      this.lastPanPoint = { x: e.clientX, y: e.clientY };
      return;
    }

    if (this.isStrokeActive) {
      this.options.onToolPointerMove?.({ x: e.offsetX, y: e.offsetY });
    }
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.releasePointerCapture(e.pointerId);
      this.canvas.style.cursor = this.isSpacePressed ? 'grab' : '';
      return;
    }

    if (this.isStrokeActive) {
      this.isStrokeActive = false;
      this.canvas.releasePointerCapture(e.pointerId);
      this.options.onToolPointerUp?.({ x: e.offsetX, y: e.offsetY });
    }
  };

  private readonly onPointerCancel = (e: PointerEvent): void => {
    if (this.isStrokeActive) {
      this.isStrokeActive = false;
      this.canvas.releasePointerCapture(e.pointerId);
      this.options.onToolPointerCancel?.();
    }
  };

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' && !e.repeat) {
      this.isSpacePressed = true;
      if (!this.isPanning) this.canvas.style.cursor = 'grab';
      e.preventDefault();
    }
    if (e.code === 'Escape' && this.isStrokeActive) {
      this.isStrokeActive = false;
      this.options.onToolPointerCancel?.();
    }
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this.isSpacePressed = false;
      if (!this.isPanning) this.canvas.style.cursor = '';
    }
  };
}
