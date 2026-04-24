import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { Rect, Size, Vector2 } from '../../../core/models/canvas.model';

@Directive({
  selector: '[appPanelResize]',
})
export class PanelResize {
  public readonly edge = input.required<string>({ alias: 'appPanelResize' });
  public readonly resizeChange = output<Rect>();
  public readonly minSize = input.required<Size>();
  public readonly maxSize = input.required<Size>();

  private readonly host = inject(ElementRef<HTMLElement>);

  private startMousePos: Vector2 = { x: 0, y: 0 };
  private startRect: Rect = { width: 0, height: 0, x: 0, y: 0 };

  constructor() {
    this.host.nativeElement.addEventListener('pointerdown', this.onPointerDown);
  }

  private readonly onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const panel = this.host.nativeElement.parentElement as HTMLElement;
    this.startRect = panel.getBoundingClientRect();
    this.startMousePos = { x: e.clientX, y: e.clientY };

    this.host.nativeElement.setPointerCapture(e.pointerId);

    this.host.nativeElement.addEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.addEventListener('pointerup', this.onPointerUp);
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    const dx = e.clientX - this.startMousePos.x;
    const dy = e.clientY - this.startMousePos.y;
    const edge = this.edge();
    const min = this.minSize();
    const max = this.maxSize();

    let { x, y, width, height } = this.startRect;

    if (edge.includes('e')) {
      width = Math.min(max.width, Math.max(min.width, width + dx));
    }

    if (edge.includes('w')) {
      const newWidth = Math.min(max.width, Math.max(min.width, width - dx));
      x += width - newWidth;
      width = newWidth;
    }

    if (edge.includes('n')) {
      const newHeight = Math.min(max.height, Math.max(min.height, height - dy));
      y += height - newHeight;
      height = newHeight;
    }
    if (edge.includes('s')) {
      height = Math.min(max.height, Math.max(min.height, height + dy));
    }

    this.resizeChange.emit({ x, y, width, height });
  };

  private readonly onPointerUp = (e: PointerEvent) => {
    this.host.nativeElement.releasePointerCapture(e.pointerId);
    this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.removeEventListener('pointerup', this.onPointerUp);
  };
}
