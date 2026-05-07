import { HOTKEY_DEFAULTS } from '../../constants/hotkey-defaults.constants';
import { HotkeyBinding } from '../../models/hotkeys';

export interface SettingsSlice {
  maxHistorySize: number;
  hotkeys: HotkeyBinding[];
}

export const initialSettings: SettingsSlice = {
  maxHistorySize: 100,
  hotkeys: HOTKEY_DEFAULTS,
};
