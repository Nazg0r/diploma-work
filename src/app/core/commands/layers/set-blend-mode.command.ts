import { Command } from '../../models/commands/command.model';
import { BlendMode, Layer } from '../../models/layers';

interface LayerStoreApi {
  setBlendMode(id: string, blendMode: BlendMode): void;
  getLayer(id: string): Layer | null;
}

export class SetBlendModeCommand implements Command {
  public readonly id = 'set-blend-mode';
  public readonly label;

  constructor(
    private readonly store: LayerStoreApi,
    private readonly layerId: string,
    private readonly newMode: BlendMode,
    private readonly oldMode: BlendMode,
  ) {
    this.label = `Set "${newMode}" Blend Mode on "${this.store.getLayer(layerId)?.name}"`;
  }

  public execute(): void {
    this.store.setBlendMode(this.layerId, this.newMode);
  }

  public undo(): void {
    this.store.setBlendMode(this.layerId, this.oldMode);
  }
}
