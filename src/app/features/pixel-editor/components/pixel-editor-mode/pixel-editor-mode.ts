import { Component } from '@angular/core';
import { LAYER_STORE, SpriteLayerStore } from '../../../../core/stores/layers';
import { CanvasControls } from '../../../../shared/panel-system/components/canvas-controls/canvas-controls';
import { Header } from '../../../../shared/panel-system/components/header/header';
import { LogActionsBar } from '../../../../shared/panel-system/components/log-actions-bar/log-actions-bar';
import { NonCollapsedPanel } from '../../../../shared/panel-system/components/non-collapse-panel/non-collapsed-panel';
import { Panel } from '../../../../shared/panel-system/components/panel/panel';
import { ToolOptionsBar } from '../../../../shared/panel-system/components/tool-options-bar/tool-options-bar';
import { Canvas } from '../../canvas/components/canvas/canvas';
import { PixelEditorLayersContent } from '../../layers/components/pixel-editor-layers-content/pixel-editor-layers-content';
import { PixelEditorLayersFooter } from '../../layers/components/pixel-editor-layers-footer/pixel-editor-layers-footer';
import { PalettePanel } from '../../palette/components/palette-panel/palette-panel';
import { ToolContextService } from '../../services/tool-context.service';
import { PencilToolOptions } from '../../tools/components/pencil-tool-options/pencil-tool-options';
import { PixelEditorToolbarContent } from '../../tools/components/pixel-editor-toolbar-content/pixel-editor-toolbar-content';
import { PixelEditorToolbarFooter } from '../../tools/components/pixel-editor-toolbar-footer/pixel-editor-toolbar-footer';

@Component({
  selector: 'app-pixel-editor-mode',
  imports: [
    Canvas,
    CanvasControls,
    Header,
    Panel,
    PixelEditorLayersContent,
    PixelEditorLayersFooter,
    LogActionsBar,
    NonCollapsedPanel,
    PixelEditorToolbarContent,
    ToolOptionsBar,
    PencilToolOptions,
    PixelEditorToolbarFooter,
    PalettePanel,
  ],
  templateUrl: './pixel-editor-mode.html',
  providers: [
    SpriteLayerStore,
    ToolContextService,
    { provide: LAYER_STORE, useExisting: SpriteLayerStore },
  ],
})
export class PixelEditorMode {}
