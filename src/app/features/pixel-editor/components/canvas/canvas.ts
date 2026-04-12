import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { Size } from '../../../../core/models/canvas.model';
import { Viewport } from '../../../../core/models/viewport.model';
import { DEFAULT_VIEWPORT_CONFIG } from '../../constants/viewport.constants';
import { PixelEditorEngine } from '../../engine/pixel-editor-engine';
import { CanvasStore } from '../../stores/canvas.store';
import { Scrollbar } from '../scrollbar/scrollbar';
import {
  calculateHorizontalScrollbar,
  calculateVerticalScrollbar,
} from '../scrollbar/scrollbar.utils';

@Component({
  selector: 'app-pixel-editor-canvas',
  imports: [Scrollbar],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
  providers: [PixelEditorEngine],
})
export class Canvas implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly hostRef = inject(ElementRef);

  protected readonly store = inject(CanvasStore);
  private readonly engine = inject(PixelEditorEngine);
  protected readonly viewport = signal<Viewport>(DEFAULT_VIEWPORT_CONFIG);
  protected readonly viewportSize = signal<Size>({ width: 0, height: 0 });

  protected readonly canvasWidth = computed(
    () => this.store.canvasSize().width * this.viewport().zoom,
  );
  protected readonly canvasHeight = computed(
    () => this.store.canvasSize().height * this.viewport().zoom,
  );

  private resizeObserver!: ResizeObserver;

  protected readonly viewportWidth = computed(() => this.viewportSize().width);
  protected readonly viewportHeight = computed(() => this.viewportSize().height);

  protected readonly horizontalState = computed(() => {
    return calculateHorizontalScrollbar(
      this.viewport(),
      this.store.canvasSize(),
      this.viewportWidth(),
    );
  });
  protected readonly verticalState = computed(() => {
    return calculateVerticalScrollbar(
      this.viewport(),
      this.store.canvasSize(),
      this.viewportHeight(),
    );
  });

  ngAfterViewInit(): void {
    this.engine.onViewportChange = (vp) => this.viewport.set(vp);
    this.engine.mount(this.canvasRef()!.nativeElement, this.store.canvasSize());
    this.watchResize();

    effect(() => {
      const gridConfig = this.store.gridConfig();
      this.engine.changeGridConfig(gridConfig);
    });
  }

  private watchResize(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.viewportSize.set({ width, height });
      this.engine.resize();
    });
    this.resizeObserver.observe(this.hostRef.nativeElement);
  }

  protected onVerticalScroll(offsetY: number): void {
    this.engine.setOffset({ x: this.viewport().offset.x, y: offsetY });
  }

  protected onHorizontalScroll(offsetX: number): void {
    this.engine.setOffset({ x: offsetX, y: this.viewport().offset.y });
  }

  ngOnDestroy(): void {
    this.engine.unMount();
  }
}
