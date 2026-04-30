export type LayerKind = 'pixel' | 'tile' | 'object'

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn';

export interface BaseLayer {
  readonly id: string;
  readonly kind: LayerKind;
  name: string;
  blendMode: BlendMode;
  isVisible: boolean;
  isLocked: boolean;
  opacity: number;
  parentId: string | null;
}
