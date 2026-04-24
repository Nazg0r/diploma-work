import { PartialStateUpdater } from '@ngrx/signals';
import { Size, Vector2 } from '../../models/canvas.model';
import { PanelId, PanelModel } from '../../models/panel.model';
import { PanelSlice } from './panel.slice';

function patchPanel(
  panelId: PanelId,
  patch: Partial<PanelModel> | ((panel: PanelModel) => Partial<PanelModel>),
): PartialStateUpdater<PanelSlice> {
  return (store) => {
    const current = store.panels[panelId];
    const changes = typeof patch === 'function' ? patch(current) : patch;
    return {
      panels: {
        ...store.panels,
        [panelId]: { ...current, ...changes },
      },
    };
  };
}

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

export function bringToForward(panelId: PanelId): PartialStateUpdater<PanelSlice> {
  return (store) => {
    if (store.panels[panelId].zIndex === store.topZIndex) {
      return {};
    }
    const newZ = store.topZIndex + 1;
    return {
      topZIndex: newZ,
      panels: {
        ...store.panels,
        [panelId]: { ...store.panels[panelId], zIndex: newZ },
      },
    };
  };
}

export const collapsePanel = (panelId: PanelId) => patchPanel(panelId, { state: 'collapsed' });

export const hidePanel = (panelId: PanelId) => patchPanel(panelId, { state: 'hidden' });

export const deactivatePanel = (panelId: PanelId) => patchPanel(panelId, { state: 'inactive' });

export const updatePosition = (panelId: PanelId, position: Vector2) =>
  patchPanel(panelId, { position });

export const updateSize = (panelId: PanelId, size: Size) => patchPanel(panelId, { size });

export const resetSize = (panelId: PanelId) =>
  patchPanel(panelId, (panel) => ({ size: panel.minSize }));
