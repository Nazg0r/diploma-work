import { Component } from '@angular/core';
import { LAYER_STORE, LevelLayerStore } from '../../../../core/stores/layers';
import { LayersContent } from '../../../../shared/layers/components';

@Component({
  selector: 'app-level-editor-layers',
  imports: [LayersContent],
  template: '<app-layers-content />',
  providers: [LevelLayerStore, { provide: LAYER_STORE, useExisting: LevelLayerStore }],
})
export class LevelEditorLayers {}
