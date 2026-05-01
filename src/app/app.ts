import { Component, inject, OnInit } from '@angular/core';
import { SpriteService } from './core/services/sprite.service';
import { LevelEditorMode } from './features/level-editor/components/level-editor-mode/level-editor-mode';
import { PixelEditorMode } from './features/pixel-editor/components/pixel-editor-mode/pixel-editor-mode';

@Component({
  selector: 'app-root',
  imports: [PixelEditorMode, LevelEditorMode],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private sprite = inject(SpriteService);

  public ngOnInit(): void {
    this.sprite.load();
  }
}
