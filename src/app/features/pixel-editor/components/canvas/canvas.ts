import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { PixelEditorEngine } from '../../engine/pixel-editor-engine';
import { CanvasStore } from '../../stores/canvas.store';

@Component({
  selector: 'app-pixel-editor-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
  providers: [PixelEditorEngine],
})
export class Canvas implements AfterViewInit, OnDestroy {
  private engine = inject(PixelEditorEngine);
  private store = inject(CanvasStore);
  private hostRef = inject(ElementRef);
  private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  ngAfterViewInit(): void {
    this.engine.mount(this.canvasRef()!.nativeElement, this.store.canvasSize());

    effect(() => {
      const gridConfig = this.store.gridConfig();
      this.engine.changeGridConfig(gridConfig);
    });
  }

  ngOnDestroy(): void {
    this.engine.unMount();
  }
}
