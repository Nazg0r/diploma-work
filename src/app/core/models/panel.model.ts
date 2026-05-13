import { Size, Vector2 } from './canvas.model';

export type PanelId = 'layers' | 'preview' | 'tileset' | 'grid' | 'history' | 'tools';
export type PanelState = 'hidden' | 'collapsed' | 'expanded' | 'inactive';
export type PanelAnchor = 'left' | 'bottom' | 'right' | 'none';

export interface PanelModel {
  id: PanelId;
  icon: string;
  state: PanelState;
  anchor: PanelAnchor;
  title: string;
  position: Vector2;
  size: Size;
  minSize: Size;
  maxSize: Size;
  zIndex: number;
}
