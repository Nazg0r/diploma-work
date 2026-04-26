import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Size, Vector2 } from '../../models/canvas.model';
import { PanelId, PanelModel, PanelState } from '../../models/panel.model';
import { initialPanelSlices } from './panel.slice';
import * as updaters from './panel.updaters';
import { PanelAnchoringService } from '../../services/panel-anchoring.service';

export const PanelStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialPanelSlices),
  withComputed((store) => {
    function filterPanelsByState(state: PanelState): PanelModel[] {
      return Object.values(store.panels()).filter((panel) => panel.state === state);
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
      expand: (panelId: PanelId) => patchState(store, updaters.expandPanel(panelId)),
      collapse: (panelId: PanelId) => patchState(store, updaters.collapsePanel(panelId)),
      hide: (panelId: PanelId) => patchState(store, updaters.hidePanel(panelId)),
      deactivate: (panelId: PanelId) => patchState(store, updaters.deactivatePanel(panelId)),
      bringToForward: (panelId: PanelId) => patchState(store, updaters.bringToForward(panelId)),
      updatePosition: (panelId: PanelId, position: Vector2) =>
        patchState(store, updaters.updatePosition(panelId, position)),
      updateSize: (panelId: PanelId, size: Size) =>
        patchState(store, updaters.updateSize(panelId, size)),
      resetSize: (panelId: PanelId) => patchState(store, updaters.resetSize(panelId)),
    };
  }),
  withHooks({
    onInit(store) {
      const anchoring = inject(PanelAnchoringService);

      const allPanels = Object.values(store.panels());

      allPanels.forEach((panel) => {
        const position = anchoring.getAnchoredPosition(panel, allPanels);
        patchState(store, updaters.updatePosition(panel.id, position));
      });
    },
  }),
);
