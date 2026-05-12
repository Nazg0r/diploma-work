import { ToolId } from '../../../../core/models/tools/tool-context.model';

export interface ToolSlice {
  activeTool: ToolId;
  brushSize: number;
  color: string;
  perfectPixel: boolean;
  opacity: number;
}

export const initialToolSlice: ToolSlice = {
  activeTool: 'pencil',
  brushSize: 1,
  color: '#000000',
  perfectPixel: false,
  opacity: 1,
};
