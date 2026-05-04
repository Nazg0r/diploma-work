import { Command, MergeableCommand } from '../../models/commands/command.model';

interface LayerStoreApi {
  setLayerName(id: string, name: string): void;
}

export class RenameLayerCommand implements MergeableCommand<RenameLayerCommand> {
  public readonly id = 'rename-layer';
  public readonly label = 'Rename Layer';

  constructor(
    private readonly store: LayerStoreApi,
    private readonly layerId: string,
    private readonly newName: string,
    private readonly oldName: string,
    public readonly timestamp: number = Date.now(),
  ) {}

  public execute(): void {
    this.store.setLayerName(this.layerId, this.newName);
  }

  public undo(): void {
    this.store.setLayerName(this.layerId, this.oldName);
  }

  public canMerge(command: Command): command is RenameLayerCommand {
    if (!(command instanceof RenameLayerCommand)) return false;
    if (command.layerId !== this.layerId) return false;
    return this.timestamp - command.timestamp <= 1000;
  }

  public merge(command: RenameLayerCommand): RenameLayerCommand {
    return new RenameLayerCommand(
      this.store,
      this.layerId,
      this.newName,
      command.oldName,
      this.timestamp,
    );
  }
}
