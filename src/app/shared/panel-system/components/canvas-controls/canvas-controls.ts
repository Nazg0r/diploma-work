import { Component } from '@angular/core';
import { Icon } from '../../../icons/components/icon/icon';
import { LG_ICON_SIZE } from '../../../../core/constants/size.constants';

@Component({
  selector: 'app-canvas-controls',
  imports: [Icon],
  templateUrl: './canvas-controls.html',
  styleUrl: './canvas-controls.scss',
  host: {
  }
})
export class CanvasControls {
  protected readonly LG_ICON_SIZE = LG_ICON_SIZE;
}
