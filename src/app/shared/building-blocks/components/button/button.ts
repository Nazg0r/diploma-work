import { Component, input } from '@angular/core';

export type ButtonKind = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public readonly variant = input<ButtonKind>('primary');
  public readonly disabled = input<boolean>(false);
}
