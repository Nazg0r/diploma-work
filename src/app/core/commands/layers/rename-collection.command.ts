import { Command, MergeableCommand } from '../../models/commands/command.model';

interface LayerStoreApi {
  setCollectionName(id: string, name: string): void;
}

export class RenameCollectionCommand implements MergeableCommand<RenameCollectionCommand> {
  public readonly id = 'rename-collection';
  public readonly label = 'Rename Collection';

  constructor(
    private readonly store: LayerStoreApi,
    private readonly collectionId: string,
    private readonly newName: string,
    private readonly oldName: string,
    public readonly timestamp: number = Date.now(),
  ) {}

  public execute(): void {
    this.store.setCollectionName(this.collectionId, this.newName);
  }

  public undo(): void {
    this.store.setCollectionName(this.collectionId, this.oldName);
  }

  public canMerge(command: Command): command is RenameCollectionCommand {
    if (!(command instanceof RenameCollectionCommand)) return false;
    if (command.collectionId !== this.collectionId) return false;
    return this.timestamp - command.timestamp <= 1000;
  }

  public merge(command: RenameCollectionCommand): RenameCollectionCommand {
    return new RenameCollectionCommand(
      this.store,
      this.collectionId,
      this.newName,
      command.oldName,
      this.timestamp,
    );
  }
}
