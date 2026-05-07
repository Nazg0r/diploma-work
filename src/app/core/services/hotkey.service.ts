import { computed, inject, Injectable } from '@angular/core';
import { HotkeyAction } from '../constants/hotkey-actions.constants';
import { SettingsStore } from '../stores/settings/settings.store';
import { KeyCombo } from '../models/hotkeys';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class HotkeyService {
  private readonly settings = inject(SettingsStore);
  private readonly handlers = new Map<HotkeyAction, () => void>();

  private readonly comboLookup = computed(() => {
    const map = new Map<string, HotkeyAction>();
    for (const binding of this.settings.hotkeys()) {
      for (const combo of binding.combos) {
        map.set(this.comboToString(combo), binding.action);
      }
    }
    return map;
  });

  constructor() {
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe((e) => this.handleKeyDown(e));
  }

  public register(action: HotkeyAction, handler: () => void) {
    this.handlers.set(action, handler);
  }

  public unregister(action: HotkeyAction): void {
    this.handlers.delete(action);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.isTypingContext(e.target)) return;

    const combo = this.eventToCombo(e);
    const serialized = this.comboToString(combo);
    const action = this.comboLookup().get(serialized);

    if (!action) return;

    const handler = this.handlers.get(action);
    if (!handler) return;

    e.preventDefault();
    handler();
  }

  private isTypingContext(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;

    const tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return true;

    return target.isContentEditable;
  }

  private eventToCombo(e: KeyboardEvent): KeyCombo {
    return {
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey || e.metaKey,
      shift: e.shiftKey,
      alt: e.altKey,
    };
  }

  private comboToString(combo: KeyCombo): string {
    const parts: string[] = [];
    if (combo.ctrl) parts.push('ctrl');
    if (combo.shift) parts.push('shift');
    if (combo.alt) parts.push('alt');
    parts.push(combo.key.toLowerCase());
    return parts.join('+');
  }
}
