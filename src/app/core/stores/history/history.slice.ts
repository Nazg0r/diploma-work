import { Command } from '../../models/commands/command.model';

export interface HistorySlice {
  past: Command[];
  future: Command[];
}

export const initialHistory : HistorySlice = {
  future: [],
  past: []
}
