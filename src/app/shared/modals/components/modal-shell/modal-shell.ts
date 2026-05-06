import { Component, input, output } from '@angular/core';
import { MD_ICON_SIZE } from '../../../../core/constants/size.constants';
import { Icon } from '../../../icons/components/icon/icon';

@Component({
  selector: 'app-modal-shell',
  imports: [Icon],
  templateUrl: './modal-shell.html',
  styleUrl: './modal-shell.scss',
})
export class ModalShell {
  protected readonly MD_ICON_SIZE = MD_ICON_SIZE;
  public readonly title = input.required<string>();
  public readonly close = output<void>();

  protected onBackdropClick(): void {
    this.close.emit();
  }

  protected onCloseClick(): void {
    this.close.emit();
  }

  protected stopPropagation(e: MouseEvent): void {
    e.stopPropagation();
  }
}
