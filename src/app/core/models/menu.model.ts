import { MENU_IDS } from '../constants/menu-ids.constants';

const menuIdSet: ReadonlySet<string> = new Set(MENU_IDS);

export interface MenuItemState {
  id: MenuId;
  label: string;
  action?: () => void;
  children?: MenuItemState[];
  dividerAfter?: boolean;
  icon?: string;
  shortcut?: string;
  isDisabled?: boolean;
}

export type MenuId = (typeof MENU_IDS)[number];

export function isMenuId(value: string): value is MenuId {
  return menuIdSet.has(value);
}
