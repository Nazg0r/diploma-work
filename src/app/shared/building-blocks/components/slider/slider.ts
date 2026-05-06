import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider {
  public readonly value = input<number>(0);
  public readonly min = input<number>(0);
  public readonly max = input<number>(100);
  public readonly step = input<number>(1);

  public readonly valueChange = output<number>();

  protected readonly track = viewChild.required<ElementRef<HTMLDivElement>>('track');

  private isDragging = false;

  protected readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    const percent = ((this.value() - this.min()) / range) * 100;
    return Math.max(0, Math.min(100, percent));
  });

  protected readonly displayValue = computed(() => Math.round(this.value()));

  protected onPointerDown(e: PointerEvent): void {
    e.preventDefault();
    this.isDragging = true;
    this.track().nativeElement.setPointerCapture(e.pointerId);
    this.moveTrack(e.clientX);
  }

  protected onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) return;
    this.moveTrack(e.clientX);
  }

  protected onPointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track().nativeElement.releasePointerCapture(e.pointerId);
  }

  private moveTrack(clientX: number): void {
    const rect = this.track().nativeElement.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, ratio));

    const range = this.max() - this.min();
    const rawValue = this.min() + clamped * range;

    const stepped = Math.round(rawValue / this.step()) * this.step();
    const final = Math.max(this.min(), Math.min(this.max(), stepped));

    if (final !== this.value()) {
      this.valueChange.emit(final);
    }
  }
}
