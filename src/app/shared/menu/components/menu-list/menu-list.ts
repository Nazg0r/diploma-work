import { Component, input, output } from '@angular/core';
import { MenuItemState } from '../../../../core/models/menu.model';
import { MenuItem } from '../index';

@Component({
  selector: 'app-menu-list',
  imports: [MenuItem],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss',
})
export class MenuList {
  public readonly items = input.required<MenuItemState[]>();
  public readonly depth = input.required<number>();

  public readonly itemClick = output<MenuItemState>();

  protected onItemClick(item: MenuItemState): void {
    this.itemClick.emit(item);
  }
}
