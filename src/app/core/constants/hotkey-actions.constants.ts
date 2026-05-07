export const HOTKEY_ACTIONS = [
  'undo',
  'redo',
] as const;

export type HotkeyAction = (typeof HOTKEY_ACTIONS)[number];
