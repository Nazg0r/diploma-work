import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-channel-slider',
  imports: [],
  templateUrl: './channel-slider.html',
  styleUrl: './channel-slider.scss',
})
export class ChannelSlider {
  public readonly label = input.required<string>();
  public readonly value = input.required<number>();
  public readonly min = input<number>(0);
  public readonly max = input<number>(255);

  public readonly trackColors = input.required<string[]>();

  public readonly valueChange = output<number>();

  private isDragging = false;
  private trackEl: HTMLElement | null = null;

  protected readonly thumbPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return ((this.value() - this.min()) / range) * 100;
  });

  protected readonly trackGradient = computed(() => {
    return `linear-gradient(to right, ${this.trackColors().join(', ')})`;
  });

  protected onPointerDown(e: PointerEvent): void {
    e.preventDefault();
    this.trackEl = e.currentTarget as HTMLElement;
    this.isDragging = true;
    this.trackEl.setPointerCapture(e.pointerId);
    this.updateFromEvent(e);

    this.trackEl.addEventListener('pointermove', this.onPointerMove);
    this.trackEl.addEventListener('pointerup', this.onPointerUp);
  }

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging) return;
    this.updateFromEvent(e);
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging || !this.trackEl) return;
    this.isDragging = false;
    this.trackEl.releasePointerCapture(e.pointerId);
    this.trackEl.removeEventListener('pointermove', this.onPointerMove);
    this.trackEl.removeEventListener('pointerup', this.onPointerUp);
  };

  private updateFromEvent(e: PointerEvent): void {
    if (!this.trackEl) return;
    const rect = this.trackEl.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const range = this.max() - this.min();
    const newValue = Math.round(this.min() + ratio * range);
    if (newValue !== this.value()) {
      this.valueChange.emit(newValue);
    }
  }
}
