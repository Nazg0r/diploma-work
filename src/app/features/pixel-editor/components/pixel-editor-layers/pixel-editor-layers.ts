import { Component } from '@angular/core';
import { LAYER_STORE, SpriteLayerStore } from '../../../../core/stores/layers';
import { LayersContent } from '../../../../shared/layers/components';

@Component({
  selector: 'app-pixel-editor-layers',
  imports: [LayersContent],
  template: '<app-layers-content />',
  providers: [SpriteLayerStore, { provide: LAYER_STORE, useExisting: SpriteLayerStore }],
})
export class PixelEditorLayers {}
