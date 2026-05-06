import { Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { SM_ICON_SIZE } from '../../../../core/constants/size.constants';
import { SelectOption } from '../../../../core/models/building-blocks';
import { Icon } from '../../../icons/components/icon/icon';


@Component({
  selector: 'app-select',
  imports: [Icon],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Select {
  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  public readonly value = input.required<string>();
  public readonly options = input.required<SelectOption[]>();
  public readonly placeholder = input<string>('Select...');

  public readonly valueChange = output<string>();

  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly isOpen = signal(false);

  protected readonly selectedOption = computed(
    () => this.options().find((option) => option.value === this.value()) ?? null,
  );

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  protected selectOption(option: SelectOption): void {
    this.isOpen.set(false);
    if (option.value !== this.value()) {
      this.valueChange.emit(option.value);
    }
  }

  protected onDocumentClick(e: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.isOpen.set(false);
    }
  }

  protected onEscape(): void {
    if (this.isOpen()) this.isOpen.set(false);
  }
}
