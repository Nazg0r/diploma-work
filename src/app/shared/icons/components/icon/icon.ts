import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: {
    'style.display': 'block',
    '[style.width]': 'size()',
    '[style.height]': 'size()',
  },
})
export class Icon {
  public readonly name = input.required<string>();
  public readonly size = input<number>(32);
}
