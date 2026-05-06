import { Command } from '../../models/commands/command.model';
import { BlendMode } from '../../models/layers';

interface LayerStoreApi {
  setBlendMode(id: string, blendMode: BlendMode): void;
}

export class SetBlendModeCommand implements Command {
  public readonly id = 'set-blend-mode';
  public readonly label = 'Change Blend Mode';

  constructor(
    private readonly store: LayerStoreApi,
    private readonly layerId: string,
    private readonly newMode: BlendMode,
    private readonly oldMode: BlendMode,
  ) {}

  public execute(): void {
    this.store.setBlendMode(this.layerId, this.newMode);
  }

  public undo(): void {
    this.store.setBlendMode(this.layerId, this.oldMode);
  }
}
