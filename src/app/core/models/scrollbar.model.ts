export interface ScrollbarState {
  readonly position: number;
  readonly size: number;
  readonly isVisible: boolean;
}

export type ScrollbarOrientation = 'horizontal' | 'vertical';
