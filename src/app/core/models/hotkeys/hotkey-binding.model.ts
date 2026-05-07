import { HotkeyAction } from '../../constants/hotkey-actions.constants';
import { KeyCombo } from './key-combo.model';

export interface HotkeyBinding {
  action: HotkeyAction;
  combos: KeyCombo[];
}
