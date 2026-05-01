import { Component } from '@angular/core';
import { LAYER_STORE, SpriteLayerStore } from '../../../../core/stores/layers';
import { CanvasControls } from '../../../../shared/panel-system/components/canvas-controls/canvas-controls';
import { Header } from '../../../../shared/panel-system/components/header/header';
import { Panel } from '../../../../shared/panel-system/components/panel/panel';
import { Canvas } from '../canvas/canvas';
import { PixelEditorLayers } from '../pixel-editor-layers/pixel-editor-layers';

@Component({
  selector: 'app-pixel-editor-mode',
  imports: [Canvas, CanvasControls, Header, Panel, PixelEditorLayers],
  templateUrl: './pixel-editor-mode.html',
  providers: [SpriteLayerStore, { provide: LAYER_STORE, useExisting: SpriteLayerStore }],
})
export class PixelEditorMode {}
