import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { Size } from '../models/canvas.model';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly _size = signal<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  public readonly size = this._size.asReadonly();
  public readonly width = () => this._size().width;
  public readonly height = () => this._size().height;

  constructor() {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this._size.set({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
  }
}
