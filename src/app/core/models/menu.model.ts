export interface MenuItemState {
  id: string;
  label: string;
  action?: () => void;
  children?: MenuItemState[];
  dividerAfter?: boolean;
  icon?: string;
  shortcut?: string;
  isDisabled?: boolean;
}
