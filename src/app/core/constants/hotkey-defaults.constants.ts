import { HotkeyBinding } from '../models/hotkeys';

export const HOTKEY_DEFAULTS: HotkeyBinding[] = [
  { action: 'undo', combos: [{ key: 'z', ctrl: true }] },
  {
    action: 'redo',
    combos: [
      { key: 'y', ctrl: true },
      { key: 'z', ctrl: true, shift: true },
    ],
  },
];
