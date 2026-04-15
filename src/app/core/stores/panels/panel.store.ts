import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Size, Vector2 } from '../../models/canvas.model';
import { PanelId, PanelState } from '../../models/panel.model';
import { initialPanelSlices, PanelSlice } from './panel.slice';
import * as updaters from './panel.updaters';

export const PanelStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialPanelSlices),
  withComputed((store) => {
    function filterPanelsByState(state: PanelState): PanelSlice[] {
      return Object.values(store.panels).filter((pair) => (pair.state = state));
    }

    return {
      expandedPanels: computed(() => filterPanelsByState('expanded')),
      collapsedPanels: computed(() => filterPanelsByState('collapsed')),
      hiddenPanels: computed(() => filterPanelsByState('hidden')),
      staticPanels: computed(() => filterPanelsByState('static')),
      inactivePanels: computed(() => filterPanelsByState('inactive')),
    };
  }),
  withMethods((store) => {

    return {
      expend: (panelId: PanelId) => patchState(store, updaters.expandPanel(panelId)),
      collapse: (panelId: PanelId) => patchState(store, updaters.collapsePanel(panelId)),
      hide: (panelId: PanelId) => patchState(store, updaters.hidePanel(panelId)),
      deactivate: (panelId: PanelId) => patchState(store, updaters.deactivatePanel(panelId)),
      bringToForward: (panelId: PanelId) => patchState(store, updaters.bringToForward(panelId)),
      updatePosition: (panelId: PanelId, position: Vector2) =>
        patchState(store, updaters.updatePosition(panelId, position)),
      updateSize: (panelId: PanelId, size: Size) =>
        patchState(store, updaters.updateSize(panelId, size)),
    };
  }),
);
