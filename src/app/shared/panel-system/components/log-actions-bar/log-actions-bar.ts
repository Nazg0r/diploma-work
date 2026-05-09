import { Component, computed, effect, inject, signal } from '@angular/core';
import { HistoryManagerService } from '../../../../core/services/history-manager.service';
import { LOG_BAR_FADE_DELAY_MS } from '../../../../core/constants/ui-elems.constants';

@Component({
  selector: 'app-log-actions-bar',
  imports: [],
  templateUrl: './log-actions-bar.html',
  styleUrl: './log-actions-bar.scss',
  host: {
    '[class.faded]': '!visible()',
  },
})
export class LogActionsBar {
  private readonly historyService = inject(HistoryManagerService);

  protected readonly visible = signal(false);

  protected readonly actionText = computed(() => {
    const last = this.historyService.lastCommand();
    return last ? `Action (${last.operation}): ${last.command.label}` : '';
  });

  constructor() {
    let timer: ReturnType<typeof setTimeout>;

    effect(() => {
      const text = this.actionText();
      if (!text) return;

      this.visible.set(true);
      clearTimeout(timer);
      timer = setTimeout(() => this.visible.set(false), LOG_BAR_FADE_DELAY_MS);
    });
  }
}
