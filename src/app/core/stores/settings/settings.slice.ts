export interface SettingsSlice {
  maxHistorySize: number;
}

export const initialSettings: SettingsSlice = {
  maxHistorySize: 100,
}
