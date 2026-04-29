import { Command } from './command.interface';

export abstract class AtomicCommand implements Command {
  public abstract readonly id: string;
  public abstract readonly label: string;

  public abstract execute(): void;
  public abstract undo(): void;
}
