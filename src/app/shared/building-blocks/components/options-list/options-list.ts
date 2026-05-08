import { Component, computed, input, output } from '@angular/core';
import { OptionsBinding } from '../../../../core/models/building-blocks';

@Component({
  selector: 'app-options-list',
  imports: [],
  templateUrl: './options-list.html',
  styleUrl: './options-list.scss',
})
export class OptionsList {
  public readonly bindings = input.required<OptionsBinding[]>();
  public readonly visible = input.required<boolean>();
  public readonly selected = output();
  protected readonly extendedBindings = computed(() => {
    return this.bindings().map((binding: OptionsBinding) => ({
      ...binding,
      action: () => {
        binding.action();
        this.selected.emit();
      },
    }));
  });
}
