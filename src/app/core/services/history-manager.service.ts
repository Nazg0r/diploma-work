import { inject, Injectable, signal } from '@angular/core';
import { CommandInfo } from '../models/commands/command-info.model';
import { Command } from '../models/commands/command.model';
import { HistoryStore } from '../stores/history/history.store';

@Injectable({ providedIn: 'root' })
export class HistoryManagerService {
  private readonly store = inject(HistoryStore);

  private readonly _lastCommand = signal<CommandInfo | null>(null);
  public readonly lastCommand = this._lastCommand.asReadonly();

  public execute(command: Command): void {
    this.store.execute(command);
    this._lastCommand.set({
      command,
      operation: 'execute',
      timestamp: Date.now(),
    });
  }

  public undo(): void {
    if (!this.store.canUndo()) return;
    const lastCommand = this.store.past()[this.store.past().length - 1];
    this.store.undo();
    this._lastCommand.set({
      command: lastCommand,
      operation: 'undo',
      timestamp: Date.now(),
    });
  }

  public redo(): void {
    if (!this.store.canRedo()) return;
    const nextCommand = this.store.future()[this.store.future().length - 1];
    this.store.redo();
    this._lastCommand.set({
      command: nextCommand,
      operation: 'redo',
      timestamp: Date.now(),
    });
  }

  public clear(): void {
    this.store.clear();
    this._lastCommand.set(null);
  }
}
