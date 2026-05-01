import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  host: {
    '[style]': 'sizeStyle()',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.role]': '"checkbox"',
    '[attr.tabindex]': '0',
    '(click)': 'onToggle()',
  },
})
export class Checkbox {
  public readonly size = input<number>(20);
  public readonly checked = input<boolean>(false);
  public readonly change = output<boolean>();

  protected _isChecked = signal(false);

  ngOnInit() {
    this._isChecked.set(this.checked());
  }

  public isChecked = computed(() => this._isChecked());

  protected sizeStyle = computed(() => ({
    width: `${this.size()}px`,
    height: `${this.size()}px`,
  }));

  protected onToggle() {
    const next = !this._isChecked();
    this._isChecked.set(next);
    this.change.emit(next);
  }
}
