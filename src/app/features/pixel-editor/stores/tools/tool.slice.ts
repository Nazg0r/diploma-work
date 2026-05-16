import { ToolId } from '../../../../core/models/tools/tool-context.model';

export interface ToolSlice {
  activeTool: ToolId;
  brushSize: number;
  perfectPixel: boolean;
  opacity: number;
}

export const initialToolSlice: ToolSlice = {
  activeTool: 'pencil',
  brushSize: 1,
  perfectPixel: false,
  opacity: 1,
};
