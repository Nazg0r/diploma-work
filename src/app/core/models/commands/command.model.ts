export interface Command {
  id: string;
  label: string;
  description?: string;
  execute: () => void;
  undo: () => void;
  affectedLayerIds?: () => string[];
}

export interface MergeableCommand<T extends Command = MergeableCommand<any>> extends Command {
  canMerge(command: Command): command is T;
  merge(command: T): T;
}

export function isMergeable(cmd: Command): cmd is MergeableCommand {
  return (
    'canMergeWith' in cmd && typeof (cmd as { canMergeWith: unknown }).canMergeWith === 'function'
  );
}
