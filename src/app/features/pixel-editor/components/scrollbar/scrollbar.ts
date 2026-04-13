import { NgStyle } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { ScrollbarOrientation, ScrollbarState } from '../../../../core/models/scrollbar.model';
import { positionToOffset } from './scrollbar.utils';
import { HOLD_TIMEOUT, INTERVAL_DELAY } from '../../constants/scrollbar.constants';

@Component({
  selector: 'app-scrollbar',
  imports: [NgStyle],
  templateUrl: './scrollbar.html',
  styleUrl: './scrollbar.scss',
})
export class Scrollbar implements OnDestroy {
  readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');
  readonly orientation = input.required<ScrollbarOrientation>();
  readonly state = input.required<ScrollbarState>();
  readonly viewportSize = input.required<number>();
  readonly canvasSize = input.required<number>();

  offsetChange = output<number>();

  private isDragging = false;
  private dragStartMousePos = 0;
  private dragStartThumbPos = 0;
  private stepInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly isHorizontal = computed(() => this.orientation() === 'horizontal');
  protected readonly thumbSize = computed(() => {
    return this.state().size * 100;
  });
  protected readonly thumbPosition = computed(
    () => this.state().position * (100 - this.thumbSize()),
  );
  protected readonly thumbStyle = computed(() => {
    return this.isHorizontal()
      ? { width: `${this.thumbSize()}%`, left: `${this.thumbPosition()}%` }
      : { height: `${this.thumbSize()}%`, top: `${this.thumbPosition()}%` };
  });

  private stepTowards(e: PointerEvent): void {
    const trackRect = this.trackRef()!.nativeElement.getBoundingClientRect();

    const clickPos = this.isHorizontal()
      ? (e.clientX - trackRect.left) / trackRect.width
      : (e.clientY - trackRect.top) / trackRect.height;

    const currentPos = this.state().position;
    const thumbSize = this.state().size;

    const thumbStart = currentPos * (1 - thumbSize);
    const thumbEnd = thumbStart + thumbSize;

    if (clickPos >= thumbStart && clickPos <= thumbEnd) {
      this.clearStepInterval();
      return;
    }

    const step = thumbSize;
    const direction = clickPos < thumbStart ? -1 : 1;
    const newThumbPos = Math.min(1, Math.max(0, currentPos + direction * step));

    const canvasOffset = positionToOffset(newThumbPos, this.canvasSize(), this.viewportSize());
    this.offsetChange.emit(canvasOffset);
  }

  private clearStepInterval(): void {
    if (this.stepInterval !== null) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
  }

  protected onThumbPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.dragStartMousePos = this.isHorizontal() ? e.clientX : e.clientY;
    this.dragStartThumbPos = this.state().position;
    this.trackRef()!.nativeElement.setPointerCapture(e.pointerId);
    this.getThumb(e)?.classList.add('scrollbar-thumb--active');
  };

  protected onTrackPointerDown = (e: PointerEvent) => {
    if (this.isDragging) return;

    this.stepTowards(e);

    const holdTimeout = setTimeout(() => {
      this.stepInterval = setInterval(() => this.stepTowards(e), INTERVAL_DELAY);
    }, HOLD_TIMEOUT);

    const onUp = () => {
      clearTimeout(holdTimeout);
      this.clearStepInterval();
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointerup', onUp);
  };

  protected onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging || e.buttons === 0) {
      this.isDragging = false;
      return;
    }

    const trackRect = this.trackRef()!.nativeElement.getBoundingClientRect();
    const trackSize = this.isHorizontal() ? trackRect.width : trackRect.height;

    const mousePos = this.isHorizontal() ? e.clientX : e.clientY;
    const mouseDelta = mousePos - this.dragStartMousePos;

    const thumbSize = this.state().size;
    if (thumbSize >= 1) return;

    const availableTrack = trackSize * (1 - thumbSize);
    if (availableTrack <= 0) return;

    const thumbDelta = mouseDelta / availableTrack;
    const newThumbPos = Math.min(1, Math.max(0, this.dragStartThumbPos + thumbDelta));
    const canvasOffset = positionToOffset(newThumbPos, this.canvasSize(), this.viewportSize());
    this.offsetChange.emit(canvasOffset);
  };

  protected onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.trackRef()!.nativeElement.releasePointerCapture(e.pointerId);
    this.getThumb(e)?.classList.remove('scrollbar-thumb--active');
  };

  ngOnDestroy(): void {
    this.clearStepInterval();
  }

  private getThumb(e: PointerEvent): HTMLElement | null {
    return this.trackRef()!.nativeElement.querySelector('.scrollbar-thumb');
  }
}
