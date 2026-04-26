import { PanelId, PanelModel } from '../../models/panel.model';

export interface PanelSlice {
  panels: Record<PanelId, PanelModel>;
  topZIndex: number;
}

const BASE_Z_INDEX = 100;

export const initialPanelSlices: PanelSlice = {
  panels: {
    layers: {
      id: 'layers',
      icon: 'layers',
      state: 'hidden',
      anchor: 'right',
      title: 'layers',
      position: { x: 0, y: 0 },
      size: { width: 240, height: 270 },
      minSize: { width: 240, height: 270 },
      maxSize: { width: 400, height: 400 },
      zIndex: BASE_Z_INDEX,
    },
    preview: {
      id: 'preview',
      icon: 'preview',
      state: 'hidden',
      anchor: 'left',
      title: 'preview',
      position: { x: 0, y: 0 },
      size: { width: 240, height: 240 },
      minSize: { width: 240, height: 240 },
      maxSize: { width: 600, height: 600 },
      zIndex: BASE_Z_INDEX,
    },
    tileset: {
      id: 'tileset',
      icon: 'tileset',
      state: 'hidden',
      anchor: 'bottom',
      title: 'tileset',
      position: { x: 0, y: 0 },
      size: { width: 380, height: 200 },
      minSize: { width: 380, height: 200 },
      maxSize: { width: 500, height: 400 },
      zIndex: BASE_Z_INDEX,
    },
    grid: {
      id: 'grid',
      icon: 'grid',
      state: 'inactive',
      anchor: 'none',
      title: 'grid',
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      minSize: { width: 130, height: 150 },
      maxSize: { width: 300, height: 250 },
      zIndex: BASE_Z_INDEX,
    },
    history: {
      id: 'history',
      icon: 'history',
      state: 'inactive',
      anchor: 'none',
      title: 'history',
      position: { x: 0, y: 0 },
      size: { width: 220, height: 200 },
      minSize: { width: 142, height: 150 },
      maxSize: { width: 300, height: 400 },
      zIndex: BASE_Z_INDEX,
    },
  },
  topZIndex: BASE_Z_INDEX,
};
