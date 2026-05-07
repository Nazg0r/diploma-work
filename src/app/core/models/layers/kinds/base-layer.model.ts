const MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
] as const;

export type LayerKind = 'pixel' | 'tile' | 'object';

export type BlendMode = typeof MODES[number];

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

export function isBlendMode(mode: string): mode is BlendMode {
  return MODES.includes(mode as BlendMode);
}
