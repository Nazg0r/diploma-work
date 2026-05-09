import { KeyCombo } from './key-combo.model';
import { HotkeyAction } from './hotkey-action.model';

export interface HotkeyBinding {
  action: HotkeyAction;
  combos: KeyCombo[];
}
