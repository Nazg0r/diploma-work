import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { Vector2 } from '../../../core/models/canvas.model';

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

  constructor() {
    this.host.nativeElement.addEventListener('pointerdown', this.onPointerDown);
  }

  private readonly onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.startMousePos = { x: e.clientX, y: e.clientY };
    this.fixedStartPosition = this.startPos();
    this.host.nativeElement.classList.add('panel-header__drag--active');
    this.host.nativeElement.setPointerCapture(e.pointerId);

    this.host.nativeElement.addEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.addEventListener('pointerup', this.onPointerUp);
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const newPos = {
      x: this.fixedStartPosition.x + e.clientX - this.startMousePos.x,
      y: this.fixedStartPosition.y + e.clientY - this.startMousePos.y,
    };
    this.dragMove.emit(newPos);
  };

  private readonly onPointerUp = (e: PointerEvent) => {
    this.host.nativeElement.releasePointerCapture(e.pointerId);
    this.host.nativeElement.classList.remove('panel-header__drag--active');
    this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.host.nativeElement.removeEventListener('pointerup', this.onPointerUp);
  };
}
