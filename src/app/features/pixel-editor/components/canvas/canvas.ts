import { AfterViewInit, Component, ElementRef, inject, OnDestroy, viewChild, ViewChild } from '@angular/core';
import { PixelEditorEngine } from '../../engine/pixel-editor-engine';

@Component({
  selector: 'app-pixel-editor-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
  providers: [PixelEditorEngine]
})
export class Canvas implements AfterViewInit, OnDestroy {
  engine = inject(PixelEditorEngine);


  canvasRef =  viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private hostRef = inject(ElementRef);

  ngAfterViewInit(): void {
    this.engine.mount(this.canvasRef()!.nativeElement);
  }

  ngOnDestroy(): void {
    this.engine.unMount()
  }
}
