import { Component } from '@angular/core';
import { LAYER_STORE, LevelLayerStore } from '../../../../core/stores/layers';
import { Header } from '../../../../shared/panel-system/components/header/header';
import { Panel } from '../../../../shared/panel-system/components/panel/panel';
import { LevelEditorLayers } from '../level-editor-layers/level-editor-layers';

@Component({
  selector: 'app-level-editor-mode',
  imports: [Header, Panel, LevelEditorLayers],
  templateUrl: './level-editor-mode.html',
  providers: [LevelLayerStore, { provide: LAYER_STORE, useExisting: LevelLayerStore }],
})
export class LevelEditorMode {}
