import { Directive, effect, input } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutside {
  public readonly condition = input.required<boolean>({ alias: 'appClickOutside' });
  public readonly handler = input.required<(e: PointerEvent) => void>();
  constructor() {
    effect(() => {
      if (this.condition()) {
        document.addEventListener('pointerdown', this.handler());
        return;
      }
      document.removeEventListener('pointerdown', this.handler());
    });
  }
}
