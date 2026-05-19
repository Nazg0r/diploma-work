import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
  host: {
    '(focus)': 'attention.emit()',
    '(blur)': 'commit.emit()',
    '(keydown.enter)': 'commit.emit()',
  },
})
export class TextInput {
  public readonly value = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly valueChange = output<string>();
  public readonly attention = output();
  public readonly commit = output();

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
