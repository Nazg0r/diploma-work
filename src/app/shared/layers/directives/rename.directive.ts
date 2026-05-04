import { Directive, effect, ElementRef, inject, input, output, signal } from '@angular/core';

@Directive({
  selector: '[appRename]',
  host: {
    '(dblclick)': 'onDoubleClick($event)',
  },
})
export class RenameDirective {
  public readonly current = input.required<string>({ alias: 'appRename' });

  public readonly commit = output<string>();
  public readonly cancel = output<void>();

  private readonly host = inject(ElementRef<HTMLElement>);

  private draggableEl: HTMLElement | null = null;

  private readonly isEditing = signal(false);

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.enterEditMode();
      } else {
        this.exitEditMode();
      }
    });
  }

  protected onDoubleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.isEditing()) {
      this.isEditing.set(true);
    }
  }

  private enterEditMode(): void {
    const hostEl = this.host.nativeElement;
    this.toggleDraggable(hostEl);
    hostEl.contentEditable = 'plaintext-only';
    hostEl.classList.add('name--editing');
    hostEl.textContent = this.current();

    queueMicrotask(() => {
      hostEl.focus();
      this.selectAll();
    });

    hostEl.addEventListener('keydown', this.onKeyDown);
    hostEl.addEventListener('blur', this.onBlur);
    hostEl.addEventListener('click', this.stopPropagation);
    hostEl.addEventListener('mousedown', this.stopPropagation);
  }

  private exitEditMode(): void {
    const hostEl = this.host.nativeElement;
    this.toggleDraggable(hostEl);
    hostEl.contentEditable = 'false';
    hostEl.classList.remove('name--editing');
    hostEl.textContent = this.current();

    hostEl.removeEventListener('keydown', this.onKeyDown);
    hostEl.removeEventListener('blur', this.onBlur);
    hostEl.removeEventListener('click', this.stopPropagation);
    hostEl.removeEventListener('mousedown', this.stopPropagation);
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.commitChange();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.cancelChange();
    }
  };

  private readonly onBlur = (): void => {
    if (this.isEditing()) {
      this.commitChange();
    }
  };

  private readonly stopPropagation = (e: Event): void => {
    e.stopPropagation();
  };

  private commitChange(): void {
    const newValue = this.host.nativeElement.textContent?.trim() ?? '';
    this.isEditing.set(false);

    if (!newValue || newValue === this.current()) return;

    this.commit.emit(newValue);
  }

  private cancelChange(): void {
    this.isEditing.set(false);
    this.cancel.emit();
  }

  private selectAll(): void {
    const range = document.createRange();
    range.selectNodeContents(this.host.nativeElement);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  private toggleDraggable(hostEl: HTMLElement): void {
    if (this.isEditing()) {
      this.draggableEl = hostEl.closest('[draggable="true"]') as HTMLElement | null;
      if (this.draggableEl) this.draggableEl.draggable = false;
      return;
    }
    if (this.draggableEl) this.draggableEl.draggable = true;
    this.draggableEl = null;
  }
}
