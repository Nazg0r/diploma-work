import { PartialStateUpdater } from '@ngrx/signals';
import { HistorySlice } from './history.slice';
import { Command, isMergeable, MergeableCommand } from '../../models/commands/command.model';

export function execute(command: Command, maxSize: number): PartialStateUpdater<HistorySlice> {
  return (store) => {
    command.execute();
    const past = store.past;
    const lastCommand = past[past.length - 1];

    if (lastCommand && isMergeable(command) && command.canMerge(lastCommand)) {
      const merged = command.merge(lastCommand as MergeableCommand);
      const newPast = [...past.slice(0, -1), merged];
      return {
        past: newPast,
        future: [],
      };
    }

    const newPast = [...past, command];
    const clamped = newPast.length > maxSize ? newPast.slice(newPast.length - maxSize) : newPast;
    return {
      past: clamped,
      future: [],
    };
  };
}

export function undo(): PartialStateUpdater<HistorySlice> {
  return (store) => {
    const past = store.past;
    if (past.length === 0) return store;
    const command = past[past.length - 1];

    command.undo();

    return {
      past: past.slice(0, -1),
      future: [...store.future, command],
    };
  };
}

export function redo(): PartialStateUpdater<HistorySlice> {
  return (store) => {
    const future = store.future;
    if (future.length === 0) return store;
    const command = future[future.length - 1];

    command.execute();

    return {
      past: [...store.past, command],
      future: future.slice(0, -1),
    };
  };
}

export function clear(): PartialStateUpdater<HistorySlice> {
  return (_) => ({
    past: [],
    future: [],
  });
}

export function undoTo(index: number): PartialStateUpdater<HistorySlice> {
  return (store) => {
    const past = store.past;
    if (index < 0 || index >= past.length) return store;

    const pastSize = past.length - 1;
    const count = pastSize - index;
    for (let i = pastSize; i > count; i--) {
      const command = past[i];
      command.undo();
    }

    return {
      past: past.slice(0, index),
      future: [...store.future, ...past.slice(index + 1)],
    };
  };
}
