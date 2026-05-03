import { Command } from './command.model';

export interface CommandInfo {
  command: Command;
  operation: 'execute' | 'undo' | 'redo';
  timestamp: number;
}
