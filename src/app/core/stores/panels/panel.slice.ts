import { PanelId, PanelModel } from '../../models/panel.model';

export interface PanelSlice {
  panels: Record<PanelId, PanelModel>;
  topZIndex: number;
}

export const initialPanelSlices: PanelSlice = {
  panels: {
    layers: {
      id: 'layers',
      icon: 'layers',
      state: 'hidden',
      anchor: 'right',
      title: 'layers',
      position: { x: window.innerWidth - 256, y: 125 },
      size: { width: 240, height: 270 },
      minSize: { width: 200, height: 200 },
      maxSize: { width: 400, height: 400 },
      zIndex: 100,
    },
    preview: {
      id: 'preview',
      icon: 'preview',
      state: 'hidden',
      anchor: 'right',
      title: 'preview',
      position: { x: window.innerWidth - 256, y: 125 },
      size: { width: 240, height: 240 },
      minSize: { width: 200, height: 200 },
      maxSize: { width: 600, height: 600 },
      zIndex: 100,
    },
    tileset: {
      id: 'tileset',
      icon: 'tileset',
      state: 'hidden',
      anchor: 'bottom',
      title: 'tileset',
      position: { x: (window.innerWidth - 380) / 2, y: window.innerHeight - 216 },
      size: { width: 380, height: 200 },
      minSize: { width: 300, height: 100 },
      maxSize: { width: 500, height: 400 },
      zIndex: 100,
    },
    grid: {
      id: 'grid',
      icon: 'grid',
      state: 'inactive',
      anchor: 'bottom',
      title: 'grid',
      position: { x: window.innerWidth - 256, y: window.innerHeight - 216 },
      size: { width: 220, height: 150 },
      minSize: { width: 130, height: 150 },
      maxSize: { width: 300, height: 250 },
      zIndex: 100,
    },
    history: {
      id: 'history',
      icon: 'history',
      state: 'inactive',
      anchor: 'bottom',
      title: 'history',
      position: { x: window.innerWidth - 256, y: window.innerHeight - 216 },
      size: { width: 220, height: 200 },
      minSize: { width: 142, height: 150 },
      maxSize: { width: 300, height: 400 },
      zIndex: 100,
    },
  },
  topZIndex: 100,
};
