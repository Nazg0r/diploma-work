import { Command } from '../../models/commands/command.model';
import { Layer } from '../../models/layers';

interface LayerStoreApi {
  addLayer(layer: Layer): void;
  removeLayer(id: string): void;
  getLayer(id: string): Layer | null;
}

export class RemoveLayerCommand implements Command {
  public readonly id = 'remove-layer';
  public readonly label: string;
  private snapshot: Layer | null = null;

  constructor(
    private readonly layerId: string,
    private readonly store: LayerStoreApi,
  ) {
    const layer = store.getLayer(this.id);
    this.label = layer ? `Remove "${layer.name}"` : 'Remove Layer';
  }

  execute(): void {
    this.snapshot = this.store.getLayer(this.layerId);
    this.store.removeLayer(this.layerId);
  }

  undo(): void {
    if (this.snapshot) this.store.addLayer(this.snapshot);
  }

  public affectedLayerIds(): string[] {
    return [this.layerId];
  }
}
