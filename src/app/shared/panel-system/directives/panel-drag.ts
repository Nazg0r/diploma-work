import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { Size, Vector2 } from '../../../core/models/canvas.model';

@Directive({
  selector: '[appPanelDrag]',
})
export class PanelDrag {
  public readonly startPos = input.required<{ x: number; y: number }>();
  public readonly dragMove = output<Vector2>();

  private readonly host = inject(ElementRef<HTMLElement>);

  private isDragging: boolean = false;
  private startMousePos: Vector2 = { x: 0, y: 0 };
  private fixedStartPosition: Vector2 = { x: 0, y: 0 };
  private fixedSize: Size = { width: 0, height: 0 };

  constructor() {
    this.host.nativeElement.addEventListener('pointerdown', this.onPointerDown);
  }

  private readonly onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.startMousePos = { x: e.clientX, y: e.clientY };
    this.fixedStartPosition = this.startPos();
    this.host.nativeElement.classList.add('panel-header__drag--active')
    this.host.nativeElement.setPointerCapture(e.pointerId);
    ;
    const header = this.host.nativeElement.parentElement as HTMLElement;
    this.fixedSize = header.getBoundingClientRect();

    this.host.nativeElement.addEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.addEventListener('pointerup', this.onPointerUp);
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const raw = {
      x: this.fixedStartPosition.x + e.clientX - this.startMousePos.x,
      y: this.fixedStartPosition.y + e.clientY - this.startMousePos.y,
    };
    this.dragMove.emit(this.clamp(raw));
  };

  private readonly onPointerUp = (e: PointerEvent) => {
    this.host.nativeElement.releasePointerCapture(e.pointerId);
    this.host.nativeElement.classList.remove('panel-header__drag--active');
    this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.removeEventListener('pointerup', this.onPointerUp);
  };

  private clamp(pos: Vector2): Vector2 {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    return {
      x: Math.min(vw - this.fixedSize.width, Math.max(0, pos.x)),
      y: Math.min(vh - this.fixedSize.height, Math.max(0, pos.y)),
    };
  }
}
