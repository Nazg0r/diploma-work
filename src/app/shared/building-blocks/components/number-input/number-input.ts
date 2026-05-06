import { Component, input, output } from '@angular/core';
import {
  MAX_INPUT_NUMBER,
  MIN_INPUT_NUMBER,
} from '../../../../core/constants/building-blocks.constants';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
})
export class NumberInput {
  public readonly value = input<number>(0);
  public readonly min = input<number>(MIN_INPUT_NUMBER);
  public readonly max = input<number>(MAX_INPUT_NUMBER);
  public readonly suffix = input<string>('');
  public readonly valueChange = output<number>();

  protected onInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(value)) this.valueChange.emit(value);
  }
}
