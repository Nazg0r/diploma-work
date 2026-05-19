import { TOOLS_IDS } from '../../constants/tools.constants';
import { Layer, PixelLayer } from '../layers';
import { LayerStore } from '../../stores/layers';

export type ToolId = (typeof TOOLS_IDS)[number];

export interface ToolContext {
  layer: PixelLayer;
  layerStore: LayerStore<Layer>;
  color: string;
  brushSize: number;
  perfectPixel: boolean;
}
