import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { Layer, NodeRef } from '../../models/layers';
import { LayerSlice } from './layer.slice';

export function withLayerComputed() {
  return signalStoreFeature(
    { state: type<LayerSlice>() },

    withComputed((store) => {
      const activeLayer = computed(() => {
        const id = store.activeLayerId();
        return id ? (store.layers()[id] ?? null) : null;
      });

      const activeSiblings = computed((): NodeRef[] => {
        const layer = activeLayer();
        if (!layer) return store.rootChildren();

        return layer.parentId === null
          ? store.rootChildren()
          : (store.collections()[layer.parentId]?.children ?? []);
      });

      const activeLayerIndex = computed((): number => {
        const id = store.activeLayerId();
        if (!id) return -1;
        return activeSiblings().findIndex((ref) => ref.id === id);
      });

      const activeIndexAmongSiblings = computed((): number => {
        const id = store.activeLayerId();
        if (!id) return -1;
        return activeSiblings().findIndex((ref) => ref.id === id);
      });

      return {
        activeLayer,

        activeSiblings,

        activeLayerIndex,

        visibleLayers: computed(() =>
          Object.values(store.layers()).filter((layer) => layer.isVisible),
        ),

        layersCount: computed(() => Object.keys(store.layers()).length),

        layersInRenderOrder: computed(() => {
          const result: Layer[] = [];

          function collect(children: NodeRef[]): void {
            for (const child of children) {
              if (child.type === 'layer') {
                const layer = store.layers()[child.id];
                if (layer) result.push(layer);
              } else {
                const collection = store.collections()[child.id];
                if (collection) collect(collection.children);
              }
            }
          }

          collect(store.rootChildren());
          return result;
        }),

        canMoveUp: computed(() => {
          const index = activeIndexAmongSiblings();
          return index >= 0 && index < activeSiblings().length - 1;
        }),

        canMoveDown: computed(() => activeIndexAmongSiblings() > 0),

        canMergeUp: computed(() => {
          const index = activeIndexAmongSiblings();
          const siblings = activeSiblings();
          return index >= 0 && index < siblings.length - 1 && siblings[index + 1]?.type === 'layer';
        }),

        canMergeDown: computed(() => {
          const index = activeIndexAmongSiblings();
          return index > 0 && activeSiblings()[index - 1]?.type === 'layer';
        }),
      };
    }),
  );
}
