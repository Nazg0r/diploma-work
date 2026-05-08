import { Component } from '@angular/core';
import { LAYER_STORE, SpriteLayerStore } from '../../../../core/stores/layers';
import { CanvasControls } from '../../../../shared/panel-system/components/canvas-controls/canvas-controls';
import { Header } from '../../../../shared/panel-system/components/header/header';
import { Panel } from '../../../../shared/panel-system/components/panel/panel';
import { Canvas } from '../canvas/canvas';
import { PixelEditorLayersFooter } from '../pixel-editor-layers-footer/pixel-editor-layers-footer';
import { PixelEditorLayersContent } from '../pixel-editor-layers-content/pixel-editor-layers-content';

@Component({
  selector: 'app-pixel-editor-mode',
  imports: [
    Canvas,
    CanvasControls,
    Header,
    Panel,
    PixelEditorLayersContent,
    PixelEditorLayersFooter,
  ],
  templateUrl: './pixel-editor-mode.html',
  providers: [SpriteLayerStore, { provide: LAYER_STORE, useExisting: SpriteLayerStore }],
})
export class PixelEditorMode {}
