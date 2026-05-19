import { Component, inject } from '@angular/core';
import { MAX_BRUSH_SIZE } from '../../../../../core/constants/tools.constants';
import { Checkbox, Slider } from '../../../../../shared/building-blocks/components';
import { ToolStore } from '../../../stores/tools/tool.store';

@Component({
  selector: 'app-pencil-tool-options',
  imports: [Slider, Checkbox],
  templateUrl: './pencil-tool-options.html',
  styleUrl: './pencil-tool-options.scss',
})
export class PencilToolOptions {
  protected readonly toolStore = inject(ToolStore);

  protected readonly MAX_BRUSH_SIZE = MAX_BRUSH_SIZE;

  protected onBrushSizeChange(size: number): void {
    this.toolStore.setBrushSize(size);
  }

  protected onPerfectPixelChange(checked: boolean): void {
    this.toolStore.setPerfectPixel(checked);
  }
}
