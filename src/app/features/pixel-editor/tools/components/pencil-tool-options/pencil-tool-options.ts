import { Component, inject, signal } from '@angular/core';
import { ToolStore } from '../../../stores/tools/tool.store';
import { Checkbox, Slider } from '../../../../../shared/building-blocks/components';
import {
  INITIAL_BRUSH_SIZE,
  MAX_BRUSH_SIZE,
  OPACITY_STEP,
} from '../../../../../core/constants/tools.constants';

@Component({
  selector: 'app-pencil-tool-options',
  imports: [Slider, Checkbox],
  templateUrl: './pencil-tool-options.html',
  styleUrl: './pencil-tool-options.scss',
})
export class PencilToolOptions {
  protected readonly store = inject(ToolStore);

  protected onBrushSizeChange(size: number): void {
    this.store.setBrushSize(size);
  }

  protected onOpacityChange(percent: number): void {
    this.store.setOpacity(percent / 100);
  }

  protected onPerfectPixelChange(checked: boolean): void {
    this.store.setPerfectPixel(checked);
  }

  protected readonly MAX_BRUSH_SIZE = MAX_BRUSH_SIZE;
  protected readonly OPACITY_STEP = OPACITY_STEP;
}
