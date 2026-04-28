import { Component, ElementRef, inject, input } from '@angular/core';
import { MenuItemState } from '../../../../core/models/menu.model';
import { MenuStore } from '../../../../core/stores/menu/menu.store';
import { MenuList } from '../menu-list/menu-list';

@Component({
  selector: 'app-menu-overlay',
  imports: [MenuList],
  templateUrl: './menu-overlay.html',
  styleUrl: './menu-overlay.scss',
  host: {
    '(document:click)': 'onClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class MenuOverlay {
  public readonly items = input.required<MenuItemState[]>();
  protected readonly store = inject(MenuStore);
  protected readonly host = inject(ElementRef);

  protected onClick(e: PointerEvent) {
    if (!this.store.isOpen()) return;
    const target = e.target as Node;

    if (!this.host.nativeElement.contains(target)) {
      this.store.close();
    }
  }

  protected onEscape() {
    if (this.store.isOpen()) this.store.close();
  }

  protected onItemClick() {
    this.store.close();
  }
}
