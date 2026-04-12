import { NgStyle } from '@angular/common';
import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { ScrollbarOrientation, ScrollbarState } from '../../../../core/models/scrollbar.model';
import { positionToOffset } from './scrollbar.utils';

@Component({
  selector: 'app-scrollbar',
  imports: [NgStyle],
  templateUrl: './scrollbar.html',
  styleUrl: './scrollbar.scss',
})
export class Scrollbar {
  readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');

  readonly orientation = input.required<ScrollbarOrientation>();
  readonly state = input.required<ScrollbarState>();
  readonly viewportSize = input.required<number>();
  readonly canvasSize = input.required<number>();

  offsetChange = output<number>();

  private isDragging = false;
  private dragStartMousePos = 0;
  private dragStartThumbPos = 0;

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

  protected onThumbPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.dragStartMousePos = this.isHorizontal() ? e.clientX : e.clientY;
    this.dragStartThumbPos = this.state().position;
    this.trackRef()!.nativeElement.setPointerCapture(e.pointerId);
  };

  protected onTrackPointerDown = (e: PointerEvent) => {
    if (this.isDragging) return;

    const trackRect = this.trackRef()!.nativeElement.getBoundingClientRect();
    const clickPos = this.isHorizontal()
      ? (e.clientX - trackRect.left) / trackRect.width
      : (e.clientY - trackRect.top) / trackRect.height;

    const newThumbPos = Math.min(1, Math.max(0, clickPos - this.state().size / 2));
    const canvasOffset = positionToOffset(newThumbPos, this.canvasSize(), this.viewportSize());
    this.offsetChange.emit(canvasOffset);
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
  };
}
