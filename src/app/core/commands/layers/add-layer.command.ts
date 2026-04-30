import { Command } from '../command.interface';
import { Layer } from '../../models/layers';

interface LayerStoreApi {
  addLayer(layer: Layer): void;
  removeLayer(id: string): void;
}

export class AddLayerCommand implements Command {
  public readonly id = 'add-layer';

  constructor(
    private readonly layer: Layer,
    private readonly store: LayerStoreApi,
  ) {}

  public get label(): string {
    return `Add Layer "${this.layer.name}"`;
  }

  execute(): void {
    this.store.addLayer(this.layer);
  }
  undo(): void {
    this.store.removeLayer(this.layer.id);
  }
}
