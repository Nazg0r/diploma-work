import { MenuItemState } from '../../models/menu.model';

export function updateItemById(
  items: MenuItemState[],
  id: string,
  updater: (item: MenuItemState) => MenuItemState,
): MenuItemState[] {
  return items.map((item) => {
    if (item.id === id) return updater(item);
    if (item.children) {
      return { ...item, children: updateItemById(item.children, id, updater) };
    }
    return item;
  });
}
