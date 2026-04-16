import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Canvas } from './features/pixel-editor/components/canvas/canvas';
import { Panel } from './shared/panel-system/components/panel/panel';
import { SpriteService } from './core/services/sprite.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Canvas, Panel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private sprite = inject(SpriteService);

  public ngOnInit(): void {
    this.sprite.load();
  }
}
