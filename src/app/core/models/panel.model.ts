import { Size, Vector2 } from './canvas.model';

export type PanelId = 'layers' | 'preview' | 'tileset' | 'grid' | 'history';
export type PanelState = 'static' | 'hidden' | 'collapsed' | 'expanded' | 'inactive';
export type PanelAnchor = 'left' | 'bottom' | 'right' | 'none';
export type ResizePanelEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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
