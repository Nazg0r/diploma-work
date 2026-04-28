import { Component, inject } from '@angular/core';
import { LG_ICON_SIZE } from '../../../../core/constants/size.constants';
import { MenuStore } from '../../../../core/stores/menu/menu.store';
import { Icon } from '../../../icons/components/icon/icon';
import { MenuOverlay } from '../../../menu/components/menu-overlay/menu-overlay';

@Component({
  selector: 'app-header',
  imports: [Icon, MenuOverlay],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly LG_ICON_SIZE = LG_ICON_SIZE;

  protected readonly store = inject(MenuStore);

  protected onMenuToggle(event: PointerEvent) {
    event.stopPropagation();
    if (this.store.isOpen()) {
      this.store.close();
      return;
    }
    this.store.open();
  }
}
