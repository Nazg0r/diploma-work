export interface Command {
  id: string;
  label: string;
  description?: string;
  execute: () => void;
  undo: () => void;
}

export interface MergeableCommand extends Command {
  canMerge: (command: Command) => boolean;
  merge: (command: MergeableCommand) => MergeableCommand;
}

export function isMergeable(cmd: Command): cmd is MergeableCommand {
  return typeof (cmd as MergeableCommand).canMerge === 'function' && 'canMergeWith' in cmd ;
}
