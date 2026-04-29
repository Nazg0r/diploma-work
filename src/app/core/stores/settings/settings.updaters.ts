import { PartialStateUpdater } from '@ngrx/signals';
import { HISTORY_SIZE_MAX_LIMIT, HISTORY_SIZE_MIN_LIMIT } from '../../constants/settings.constatns';
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
