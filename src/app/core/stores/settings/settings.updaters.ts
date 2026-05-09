import { PartialStateUpdater } from '@ngrx/signals';
import { HOTKEY_DEFAULTS } from '../../constants/hotkey-defaults.constants';
import { HISTORY_SIZE_MAX_LIMIT, HISTORY_SIZE_MIN_LIMIT } from '../../constants/settings.constatns';
import { HotkeyAction, KeyCombo } from '../../models/hotkeys';
import { SettingsSlice } from './settings.slice';

export function setMaxHistorySize(maxHistorySize: number): PartialStateUpdater<SettingsSlice> {
  return (_) => {
    const clamped = Math.max(
      HISTORY_SIZE_MIN_LIMIT,
      Math.min(HISTORY_SIZE_MAX_LIMIT, maxHistorySize),
    );
    return {
      maxHistorySize: clamped,
    };
  };
}

export function setHotkey(
  action: HotkeyAction,
  combos: KeyCombo[],
): PartialStateUpdater<SettingsSlice> {
  return (store) => {
    return {
      hotkeys: store.hotkeys.map((binding) =>
        binding.action === action ? { ...binding, combos } : binding,
      ),
    };
  };
}

export function resetHotkey(action: HotkeyAction): PartialStateUpdater<SettingsSlice> {
  return (store) => ({
    hotkeys: store.hotkeys.map((binding, index) =>
      binding.action === action ? { ...binding, combos: HOTKEY_DEFAULTS[index].combos } : binding,
    ),
  });
}

export function resetHotkeys(): PartialStateUpdater<SettingsSlice> {
  return (_) => ({ hotkeys: HOTKEY_DEFAULTS });
}
