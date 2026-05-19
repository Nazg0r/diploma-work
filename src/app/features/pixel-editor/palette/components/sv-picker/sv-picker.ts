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
import { PICKER_HEIGHT, PICKER_WIDTH } from '../../../constants/color-picker.constants';

@Component({
  selector: 'app-sv-picker',
  imports: [],
  templateUrl: './sv-picker.html',
  styleUrl: './sv-picker.scss',
  host: {
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
  },
})
export class SvPicker implements AfterViewInit {
  public readonly hue = input.required<number>();
  public readonly saturation = input.required<number>();
  public readonly value = input.required<number>();

  public readonly cursorChange = output<{ s: number; v: number }>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly cursorX = signal(0);
  protected readonly cursorY = signal(0);

  protected readonly svPickerStyles = computed(() => {
    return {
      width: `${PICKER_WIDTH}px`,
      height: `${PICKER_HEIGHT}px`,
    };
  })

  private isDragging = false;

  protected readonly height = PICKER_HEIGHT;
  protected readonly width = PICKER_WIDTH;

  constructor() {
    effect(() => {
      this.renderGradient(this.hue());
    });

    effect(() => {
      this.cursorX.set((this.saturation() / 100) * this.width);
      this.cursorY.set((1 - this.value() / 100) * this.height);
    });
  }

  public ngAfterViewInit(): void {
    this.renderGradient(this.hue());
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
    const x = Math.max(0, Math.min(this.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(this.height, e.clientY - rect.top));

    const s = (x / this.width) * 100;
    const v = (1 - y / this.height) * 100;

    this.cursorChange.emit({ s, v });
  }

  private renderGradient(hue: number): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hueColor = `hsl(${hue}, 100%, 50%)`;

    const horizontalGrad = ctx.createLinearGradient(0, 0, this.width, 0);
    horizontalGrad.addColorStop(0, 'white');
    horizontalGrad.addColorStop(1, hueColor);

    ctx.fillStyle = horizontalGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    const verticalGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    verticalGrad.addColorStop(0, 'rgba(0,0,0,0)');
    verticalGrad.addColorStop(1, 'rgba(0,0,0,1)');

    ctx.fillStyle = verticalGrad;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
