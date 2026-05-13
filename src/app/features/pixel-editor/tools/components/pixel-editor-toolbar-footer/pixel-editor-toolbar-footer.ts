import { Component } from '@angular/core';
import { Icon } from '../../../../../shared/icons/components/icon/icon';
import { MD_ICON_SIZE } from '../../../../../core/constants/size.constants';

@Component({
  selector: 'app-pixel-editor-toolbar-footer',
  imports: [Icon],
  templateUrl: './pixel-editor-toolbar-footer.html',
  styleUrl: './pixel-editor-toolbar-footer.scss',
})
export class PixelEditorToolbarFooter {
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
}
