import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SLIDER_HEIGHT, SLIDER_WIDTH } from '../../../constants/color-picker.constants';

@Component({
  selector: 'app-hue-slider',
  imports: [],
  templateUrl: './hue-slider.html',
  styleUrl: './hue-slider.scss',
  host: {
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '[style.width]': 'this.width',
  },
})
export class HueSlider implements AfterViewInit {
  public readonly hue = input.required<number>();
  public readonly hueChange = output<number>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly hueSliderStyles = computed(() => {
    return {
      width: `${SLIDER_WIDTH}px`,
      height: `${SLIDER_HEIGHT}px`,
    };
  });

  private isDragging = false;

  protected readonly cursorY = signal(0);

  protected readonly width = SLIDER_WIDTH;
  protected readonly height = SLIDER_HEIGHT;

  constructor() {
    effect(() => {
      this.renderGradient();
    });

    effect(() => {
      this.cursorY.set((this.hue() / 360) * this.height);
    });
  }

  public ngAfterViewInit(): void {
    this.renderGradient();
  }

  protected onPointerDown(e: PointerEvent): void {
    e.preventDefault();
    this.isDragging = true;
    this.canvasRef().nativeElement.setPointerCapture(e.pointerId);
    this.updateFromEvent(e);
  }

  protected onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) return;
    this.updateFromEvent(e);
  }

  protected onPointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.canvasRef().nativeElement.releasePointerCapture(e.pointerId);
  }

  private updateFromEvent(e: PointerEvent): void {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    const y = Math.max(0, Math.min(this.height, e.clientY - rect.top));
    const hue = Math.round((y / this.height) * 360);
    this.hueChange.emit(hue);
  }

  private renderGradient(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, 'hsl(0, 100%, 50%)');
    grad.addColorStop(0.167, 'hsl(60, 100%, 50%)');
    grad.addColorStop(0.333, 'hsl(120, 100%, 50%)');
    grad.addColorStop(0.5, 'hsl(180, 100%, 50%)');
    grad.addColorStop(0.667, 'hsl(240, 100%, 50%)');
    grad.addColorStop(0.833, 'hsl(300, 100%, 50%)');
    grad.addColorStop(1, 'hsl(360, 100%, 50%)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
