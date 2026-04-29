import { Command } from '../../commands/command.interface';

export interface HistorySlice {
  past: Command[];
  future: Command[];
}

export const initialHistory : HistorySlice = {
  future: [],
  past: []
}
