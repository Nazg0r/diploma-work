import { Component, inject, OnInit } from '@angular/core';
import { SpriteService } from './core/services/sprite.service';
import { Canvas } from './features/pixel-editor/components/canvas/canvas';
import { CanvasControls } from './shared/panel-system/components/canvas-controls/canvas-controls';
import { Header } from './shared/panel-system/components/header/header';
import { Panel } from './shared/panel-system/components/panel/panel';

@Component({
  selector: 'app-root',
  imports: [Canvas, Panel, CanvasControls, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private sprite = inject(SpriteService);

  public ngOnInit(): void {
    this.sprite.load();
  }
}
