import { Component } from '@angular/core';
import { Icon } from '../../../icons/components/icon/icon';
import { LG_ICON_SIZE } from '../../../../core/constants/size.constants';

@Component({
  selector: 'app-header',
  imports: [Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly LG_ICON_SIZE = LG_ICON_SIZE;
}
