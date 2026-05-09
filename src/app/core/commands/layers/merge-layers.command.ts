import { Command } from '../../models/commands/command.model';
import { Layer, NodeRef, PixelLayer } from '../../models/layers';
import { LayerStore } from '../../stores/layers';
import { generateId } from '../../utils/id-generation.utils';

export type MergeDirection = 'down' | 'up';

export class MergeLayersCommand<T extends Layer> implements Command {
  public readonly id = 'merge-layers';
  public readonly label: string;

  private removedLayers: PixelLayer[] = [];
  private mergedLayer: PixelLayer | null = null;
  private previousRootChildren: NodeRef[] = [];
  private previousActiveLayerId: string | null = null;

  constructor(
    private readonly store: LayerStore<T>,
    private readonly direction: MergeDirection,
  ) {
    this.label = direction === 'down' ? 'Merge Down' : 'Merge Up';
  }

  public execute(): void {
    const { target, neighbor } = this.resolveLayers();
    if (!target || !neighbor) return;

    this.removedLayers = [target, neighbor];
    this.previousRootChildren = [...this.store.rootChildren()];
    this.previousActiveLayerId = this.store.activeLayerId();

    const [lower, upper] = this.direction === 'down' ? [neighbor, target] : [target, neighbor];

    const mergedData = this.mergeLayersData([lower, upper], target.size.width, target.size.height);

    const merged: PixelLayer = {
      ...lower,
      id: generateId('layer'),
      name: `${lower.name} + ${upper.name}`,
      data: mergedData,
      opacity: 1,
      blendMode: 'normal',
    };

    this.mergedLayer = merged;
    const siblings = this.store.getLayerSiblings(lower.parentId);
    const insertIndex = siblings.findIndex((ref) => ref.id === lower.id);

    this.store.removeLayer(target.id);
    this.store.removeLayer(neighbor.id);
    this.store.addLayer(merged);
    this.store.moveNode({ type: 'layer', id: merged.id }, lower.parentId, insertIndex);
    this.store.setActiveLayer(merged.id);
  }

  public undo(): void {
    if (!this.mergedLayer) return;

    this.store.removeLayer(this.mergedLayer.id);

    for (const layer of this.removedLayers) {
      this.store.addLayer(layer);
    }

    this.store.reorderChildren(null, this.previousRootChildren);
    this.store.setActiveLayer(this.previousActiveLayerId);
  }

  public affectedLayerIds(): string[] {
    return [this.mergedLayer?.id ?? '', ...this.removedLayers.map((l) => l.id)].filter(Boolean);
  }

  // TODO: modify on level editor mode
  private resolveLayers(): {
    target: PixelLayer | null;
    neighbor: PixelLayer | null;
  } {
    const target = this.store.activeLayer() as PixelLayer | null;
    if (!target) return { target: null, neighbor: null };

    const siblings = this.store.activeSiblings();
    const idx = siblings.findIndex((ref) => ref.id === this.store.activeLayerId());
    if (idx === -1) return { target, neighbor: null };

    const neighborIdx = this.direction === 'down' ? idx - 1 : idx + 1;
    const neighborRef = siblings[neighborIdx];

    if (!neighborRef || neighborRef.type !== 'layer') {
      return { target, neighbor: null };
    }

    const neighbor = this.store.getLayer(neighborRef.id) as PixelLayer | null;
    return { target, neighbor };
  }

  private mergeLayersData(layers: PixelLayer[], width: number, height: number): ImageData {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);

    for (const layer of layers) {
      if (!layer.isVisible) continue;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      const temp = new OffscreenCanvas(layer.size.width, layer.size.height);
      const tempCtx = temp.getContext('2d')!;
      tempCtx.putImageData(layer.data, 0, 0);

      ctx.drawImage(temp, 0, 0);
      ctx.restore();
    }

    return ctx.getImageData(0, 0, width, height);
  }
}
