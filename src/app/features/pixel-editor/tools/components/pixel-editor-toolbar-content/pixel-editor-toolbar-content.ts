import { Component, inject } from '@angular/core';
import { LG_ICON_SIZE } from '../../../../../core/constants/size.constants';
import { Icon } from '../../../../../shared/icons/components/icon/icon';
import { ToolRegistry } from '../../../services/tool-registry.service';
import { ToolId } from '../../../../../core/models/tools/tool-context.model';
import { ToolStore } from '../../../stores/tools/tool.store';

@Component({
  selector: 'app-pixel-editor-toolbar-content',
  imports: [Icon],
  templateUrl: './pixel-editor-toolbar-content.html',
  styleUrl: './pixel-editor-toolbar-content.scss',
})
export class PixelEditorToolbarContent {
  protected readonly store = inject(ToolStore);
  protected readonly toolRegistry = inject(ToolRegistry);
  protected readonly LG_ICON_SIZE = LG_ICON_SIZE;

  protected isActive(id: ToolId): boolean {
    return this.store.activeTool() === id;
  }

  protected select(id: ToolId): void {
    this.store.setActiveTool(id);
  }
}
