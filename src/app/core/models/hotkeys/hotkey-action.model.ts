import { HOTKEY_ACTIONS } from '../../constants/hotkey-actions.constants';

export type HotkeyAction = (typeof HOTKEY_ACTIONS)[number];
