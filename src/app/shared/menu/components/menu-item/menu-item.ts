import { Component, computed, forwardRef, inject, input, output } from '@angular/core';
import { SM_ICON_SIZE } from '../../../../core/constants/size.constants';
import { MenuItemState } from '../../../../core/models/menu.model';
import { MenuStore } from '../../../../core/stores/menu/menu.store';
import { Icon } from '../../../icons/components/icon/icon';
import { MenuList } from '../index';

@Component({
  selector: 'app-menu-item',
  imports: [Icon, forwardRef(() => MenuList)],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss',
})
export class MenuItem {
  public readonly item = input.required<MenuItemState>();
  public readonly depth = input.required<number>();

  public readonly itemClick = output<MenuItemState>();

  private readonly store = inject(MenuStore);

  protected readonly hasChildren = computed(() => !!this.item().children?.length);
  protected readonly isOpen = computed(
    () => this.store.openPath()[this.depth()] === this.item().id,
  );

  onMouseEnter = () => {
    if (this.item().isDisabled) return;

    if (this.hasChildren()) {
      this.store.openSubmenu(this.item().id, this.depth());
      return;
    }

    this.store.closeSubmenu(this.depth());
  };

  onClick = () => {
    if (this.item().isDisabled) return;
    if (this.hasChildren()) {
      return;
    }
    this.item().action?.();
    this.itemClick.emit(this.item());
  };

  protected onSubmenuItemClick(item: MenuItemState): void {
    this.itemClick.emit(item);
  }

  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
}
