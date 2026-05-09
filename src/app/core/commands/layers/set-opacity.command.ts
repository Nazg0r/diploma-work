import { Command, MergeableCommand } from '../../models/commands/command.model';
import { Layer } from '../../models/layers';

interface LayerStoreApi {
  setOpacity(id: string, opacity: number): void;
  getLayer(id: string): Layer | null;
}

export class SetOpacityCommand implements MergeableCommand<SetOpacityCommand> {
  public readonly id = 'set-opacity';
  public readonly label;

  constructor(
    private readonly store: LayerStoreApi,
    private readonly layerId: string,
    private readonly newOpacity: number,
    private readonly oldOpacity: number,
    public readonly timestamp: number = Date.now(),
  ) {
    this.label = `Set ${Math.round(newOpacity * 100)}% opacity on ${this.store.getLayer(layerId)?.name}`;
  }

  public execute(): void {
    this.store.setOpacity(this.layerId, this.newOpacity);
  }

  public undo(): void {
    this.store.setOpacity(this.layerId, this.oldOpacity);
  }

  public canMerge(previous: Command): previous is SetOpacityCommand {
    if (!(previous instanceof SetOpacityCommand)) return false;
    if (previous.layerId !== this.layerId) return false;
    return this.timestamp - previous.timestamp <= 2000;
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
