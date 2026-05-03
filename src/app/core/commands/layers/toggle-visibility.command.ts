import { Command } from '../../models/commands/command.model';
import { Layer } from '../../models/layers';

interface LayerStoreApi {
  toggleVisibility(id: string): void;
  getLayer(id: string): Layer;
}

export class ToggleVisibilityCommand implements Command {
  public readonly id = 'toggle-visibility';
  public readonly label: string;

  constructor(
    private readonly layerId: string,
    private readonly store: LayerStoreApi,
  ) {
    const layer = store.getLayer(layerId);
    this.label = `Toggle ${layer.name} visibility`;
  }

  execute(): void {
    this.store.toggleVisibility(this.layerId);
  }
  undo(): void {
    this.store.toggleVisibility(this.layerId);
  }
}
