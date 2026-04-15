import { PartialStateUpdater } from '@ngrx/signals';
import { Size, Vector2 } from '../../models/canvas.model';
import { PanelId } from '../../models/panel.model';
import { PanelSlice } from './panel.slice';

export function expandPanel(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => {
    const newZ = store.topZIndex + 1;
    return {
      topZIndex: newZ,
      panels: {
        ...store.panels,
        [panelId]: { ...store.panels[panelId], state: 'expanded', zIndex: newZ },
      },
    };
  };
}

export function collapsePanel(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], state: 'collapsed' } },
  });
}

export function hidePanel(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], state: 'hidden' } },
  });
}

export function deactivatePanel(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], state: 'inactive' } },
  });
}

export function bringToForward(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], zIndex: store.topZIndex } },
  });
}

export function updatePosition(panelId: PanelId, newPos: Vector2): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], position: newPos } },
  });
}

export function updateSize(panelId: PanelId, newSize: Size): PartialStateUpdater<PanelSlice> {
  return (store) => ({
    ...store,
    panels: { ...store.panels, [panelId]: { ...store.panels[panelId], size: newSize } },
  });
}
