import { Command, MergeableCommand } from '../../models/commands/command.model';

interface LayerStoreApi {
  setOpacity(id: string, opacity: number): void;
}

export class SetOpacityCommand implements MergeableCommand<SetOpacityCommand> {
  public readonly id = 'set-opacity';
  public readonly label = 'Change Opacity';

  constructor(
    private readonly store: LayerStoreApi,
    private readonly layerId: string,
    private readonly newOpacity: number,
    private readonly oldOpacity: number,
    public readonly timestamp: number = Date.now(),
  ) {}

  public execute(): void {
    this.store.setOpacity(this.layerId, this.newOpacity);
  }

  public undo(): void {
    this.store.setOpacity(this.layerId, this.oldOpacity);
  }

  public canMerge(previous: Command): previous is SetOpacityCommand {
    if (!(previous instanceof SetOpacityCommand)) return false;
    if (previous.layerId !== this.layerId) return false;
    return this.timestamp - previous.timestamp <= 500;
  }

  public merge(previous: SetOpacityCommand): SetOpacityCommand {
    return new SetOpacityCommand(
      this.store,
      this.layerId,
      this.newOpacity,
      previous.oldOpacity,
      this.timestamp,
    );
  }
}
