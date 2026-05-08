import { Component } from '@angular/core';
import { LayersContent } from '../../../../shared/layers/components';

@Component({
  selector: 'app-pixel-editor-layers-content',
  imports: [LayersContent],
  template: '<app-layers-content />',
})
export class PixelEditorLayersContent {}
