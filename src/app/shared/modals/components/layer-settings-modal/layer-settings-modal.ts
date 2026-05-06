import { Component, inject, input, signal } from '@angular/core';
import { RenameLayerCommand } from '../../../../core/commands/layers/rename-layer.command';
import { SetBlendModeCommand } from '../../../../core/commands/layers/set-blend-mode.command';
import { SetOpacityCommand } from '../../../../core/commands/layers/set-opacity.command';
import { BLEND_MODE_OPTIONS } from '../../../../core/constants/blend-mode.constants';
import { MODAL_TITLES } from '../../../../core/constants/modal.constants';
import { BlendMode, isBlendMode } from '../../../../core/models/layers';
import { LayerSettingsData } from '../../../../core/models/modals';
import { ModalRef } from '../../../../core/models/modals/modal-ref.model';
import { HistoryManagerService } from '../../../../core/services/history-manager.service';
import { LAYER_STORE } from '../../../../core/stores/layers';
import { Select, Slider, TextInput } from '../../../building-blocks/components';
import { Field } from '../../../building-blocks/components/field/field';
import { ModalShell } from '../modal-shell/modal-shell';

@Component({
  selector: 'app-layer-settings-modal',
  imports: [ModalShell, Field, TextInput, Slider, Select],
  templateUrl: './layer-settings-modal.html',
  styleUrl: './layer-settings-modal.scss',
})
export class LayerSettingsModal {
  public readonly data = input.required<LayerSettingsData>();
  public readonly modalRef = input.required<ModalRef<void>>();

  private readonly store = inject(LAYER_STORE);
  private readonly history = inject(HistoryManagerService);

  protected readonly layerName = signal<string>('');
  protected readonly opacity = signal<number>(100);
  protected readonly blendMode = signal<BlendMode>('normal');

  protected readonly blendOptions = BLEND_MODE_OPTIONS;

  ngOnInit(): void {
    const layer = this.store.getLayer(this.data().layerId);
    if (!layer) return;

    this.layerName.set(layer.name);
    this.opacity.set(Math.round(layer.opacity * 100));
    this.blendMode.set(layer.blendMode);
  }

  protected onNameChange(name: string): void {
    this.layerName.set(name);
  }

  protected onOpacityChange(percent: number): void {
    const layer = this.store.getLayer(this.data().layerId);
    if (!layer) return;

    const newOpacity = percent / 100;
    const oldOpacity = layer.opacity;
    if (newOpacity === oldOpacity) return;

    this.opacity.set(percent);
    this.history.execute(new SetOpacityCommand(this.store, layer.id, newOpacity, oldOpacity));
  }

  protected onBlendModeChange(mode: string): void {
    const layer = this.store.getLayer(this.data().layerId);
    if (!layer || layer.blendMode === mode) return;

    if (isBlendMode(mode)) {
      this.blendMode.set(mode);
      this.history.execute(new SetBlendModeCommand(this.store, layer.id, mode, layer.blendMode));
    }
  }

  protected onClose(): void {
    this.applyRename();
    this.modalRef().close();
  }

  private applyRename() {
    const layer = this.store.getLayer(this.data().layerId);
    if (!layer) return;

    const trimmed = this.layerName().trim();
    if (trimmed && trimmed !== layer.name) {
      this.history.execute(
        new RenameLayerCommand(this.store, this.data().layerId, trimmed, layer.name),
      );
    }
  }

  protected readonly MODAL_TITLES = MODAL_TITLES;
}
