import { Command, MergeableCommand } from '../../models/commands/command.model';
import { isPixelLayer, Layer } from '../../models/layers';
import { PixelChange } from '../../models/pixel-change.model';
import { LayerStore } from '../../stores/layers';
import { ToolId } from '../../models/tools/tool-context.model';

export class PaintPixelsCommand implements MergeableCommand<PaintPixelsCommand> {
  public readonly id = 'paint-pixels';

  public get label(): string {
    return this.toolId === 'pencil' ? "Paint" : "Erase";
  }

  constructor(
    private readonly store: LayerStore<Layer>,
    private readonly layerId: string,
    private readonly changes: Map<string, PixelChange>,
    private readonly toolId: ToolId,
    public readonly timestamp: number = Date.now(),
  ) {}

  public execute(): void {
    this.applyChanges('new');
  }

  public undo(): void {
    this.applyChanges('old');
  }

  public affectedLayerIds(): string[] {
    return [this.layerId];
  }

  public canMerge(previous: Command): previous is PaintPixelsCommand {
    if (!(previous instanceof PaintPixelsCommand)) return false;
    if (previous.layerId !== this.layerId) return false;
    return this.timestamp - previous.timestamp <= 500;
  }

  public merge(previous: PaintPixelsCommand): PaintPixelsCommand {
    const merged = new Map(previous.changes);

    for (const [key, change] of this.changes) {
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...change,
          oldColor: existing.oldColor,
        });
      } else {
        merged.set(key, change);
      }
    }

    return new PaintPixelsCommand(this.store, this.layerId, merged, this.toolId, this.timestamp);
  }

  private applyChanges(kind: 'new' | 'old'): void {
    const layer = this.store.getLayer(this.layerId);
    if (!layer || !isPixelLayer(layer)) return;

    const newData = new ImageData(
      new Uint8ClampedArray(layer.data.data),
      layer.size.width,
      layer.size.height,
    );

    for (const change of this.changes.values()) {
      const i = (change.y * layer.size.width + change.x) * 4;
      const color = kind === 'new' ? change.newColor : change.oldColor;
      newData.data[i] = color.r;
      newData.data[i + 1] = color.g;
      newData.data[i + 2] = color.b;
      newData.data[i + 3] = color.a;
    }

    this.store.setLayerProperties(this.layerId, { data: newData });
  }
}
