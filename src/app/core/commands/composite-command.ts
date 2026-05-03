import { Command } from '../models/commands/command.model';

export class CompositeCommand implements Command {
  public readonly id: string = 'composite';

  constructor(
    public readonly label: string,
    private readonly commands: Command[],
  ) {}

  public execute(): void {
    for (const cmd of this.commands) {
      cmd.execute();
    }
  };

  public undo(): void {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}
