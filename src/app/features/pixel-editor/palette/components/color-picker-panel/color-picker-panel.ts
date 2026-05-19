import { Component, computed, effect, inject, signal } from '@angular/core';
import { SM_ICON_SIZE } from '../../../../../core/constants/size.constants';
import { ColorStore } from '../../../stores/color/color.store';
import { Field, Select, TextInput } from '../../../../../shared/building-blocks/components';
import { Icon } from '../../../../../shared/icons/components/icon/icon';
import { NonCollapsedPanel } from '../../../../../shared/panel-system/components/non-collapse-panel/non-collapsed-panel';
import { INPUT_FIELD_WIDTH } from '../../../constants/color-picker.constants';
import {
  hexToHsva,
  hexToRgba,
  hslToRgb,
  hsvToRgb,
  isValidHex,
  rgbaToHex,
  rgbaToHsla,
  rgbaToHsva,
  rgbToHsv,
} from '../../../utils/color.util';
import { ChannelSlider } from '../channel-slider/channel-slider';
import { HueSlider } from '../hue-slider/hue-slider';
import { SvPicker } from '../sv-picker/sv-picker';

type ColorMode = 'RGBA' | 'HSLA' | 'HSVA';

@Component({
  selector: 'app-color-picker-panel',
  imports: [NonCollapsedPanel, SvPicker, HueSlider, TextInput, Select, Icon, ChannelSlider, Field],
  templateUrl: './color-picker-panel.html',
  styleUrl: './color-picker-panel.scss',
})
export class ColorPickerPanel {
  private readonly colorStore = inject(ColorStore);

  protected readonly r = signal(0);
  protected readonly g = signal(0);
  protected readonly b = signal(0);
  protected readonly a = signal(255);

  protected readonly h = signal(0);
  protected readonly s = signal(100);
  protected readonly v = signal(100);

  protected readonly hexDraft = signal('#ff0000ff');

  protected readonly mode = signal<ColorMode>('RGBA');
  protected readonly modeOptions = [
    { value: 'RGBA' as const, label: 'RGBA' },
    { value: 'HSVA' as const, label: 'HSVA' },
    // { value: 'HSLA' as const, label: 'HSLA' },
  ];

  protected readonly rgba = computed(() => ({
    r: this.r(),
    g: this.g(),
    b: this.b(),
    a: this.a(),
  }));

  protected readonly hsva = computed(() => ({
    h: this.h(),
    s: this.s(),
    v: this.v(),
    a: this.a(),
  }));

  protected readonly hsla = computed(() => rgbaToHsla({ ...this.rgba(), a: this.a() }));

  protected readonly currentColor = computed(() =>
    rgbaToHex({ ...this.rgba(), a: this.a()}),
  );
  protected readonly rTrackColors = computed(() => {
    const { g, b } = this.rgba();
    return [`rgb(0,${g},${b})`, `rgb(255,${g},${b})`];
  });

  protected readonly gTrackColors = computed(() => {
    const { r, b } = this.rgba();
    return [`rgb(${r},0,${b})`, `rgb(${r},255,${b})`];
  });

  protected readonly bTrackColors = computed(() => {
    const { r, g } = this.rgba();
    return [`rgb(${r},${g},0)`, `rgb(${r},${g},255)`];
  });

  protected readonly aTrackColors = computed(() => {
    const { r, g, b } = this.rgba();
    return [`rgba(${r},${g},${b},0)`, `rgba(${r},${g},${b},1)`];
  });

  protected readonly hTrackColors = computed(() => [
    'hsl(0,100%,50%)',
    'hsl(60,100%,50%)',
    'hsl(120,100%,50%)',
    'hsl(180,100%,50%)',
    'hsl(240,100%,50%)',
    'hsl(300,100%,50%)',
    'hsl(360,100%,50%)',
  ]);

  protected readonly hsvSTrackColors = computed(() => {
    const { h, v } = this.hsva();
    return [`hsl(0,0%,${v}%)`, `hsl(${h},100%,50%)`];
  });

  protected readonly vTrackColors = computed(() => {
    const { h, s } = this.hsva();
    return ['hsl(0,0%,0%)', `hsl(${h},${s}%,50%)`];
  });

  protected readonly sTrackColors = computed(() => {
    const { h, l } = this.hsla();
    return [`hsl(${h},0%,${l}%)`, `hsl(${h},100%,${l}%)`];
  });

  protected readonly lTrackColors = computed(() => {
    const { h, s } = this.hsla();
    return ['hsl(0,0%,0%)', `hsl(${h},${s}%,50%)`, 'hsl(0,0%,100%)'];
  });

  private isInternalUpdate = false;
  private isHexEditing = false;

  protected readonly SM_ICON_SIZE = SM_ICON_SIZE;
  protected readonly INPUT_FIELD_WIDTH = INPUT_FIELD_WIDTH;

  constructor() {
    effect(() => {
      const fg = this.colorStore.foreground();
      if (this.isInternalUpdate) return;
      if (fg === this.currentColor()) return;
      this.applyHex(fg);
    });

    effect(() => {
      const hex = this.currentColor();
      if (this.isHexEditing) return;
      this.hexDraft.set(hex);
    });
  }

  protected onSvChange(e: { s: number; v: number }): void {
    this.s.set(Math.round(e.s));
    this.v.set(Math.round(e.v));
    this.syncRgbFromHsv();
  }

  protected onHueChange(value: number): void {
    this.h.set(Math.round(value));
    this.syncRgbFromHsv();
  }

  protected onHsvHChange(v: number): void {
    this.h.set(v);
    this.syncRgbFromHsv();
  }
  protected onHsvSChange(v: number): void {
    this.s.set(v);
    this.syncRgbFromHsv();
  }
  protected onHsvVChange(v: number): void {
    this.v.set(v);
    this.syncRgbFromHsv();
  }

  protected onRChange(value: number): void {
    this.r.set(value);
    this.syncHsvFromRgb();
  }

  protected onGChange(value: number): void {
    this.g.set(value);
    this.syncHsvFromRgb();
  }

  protected onBChange(value: number): void {
    this.b.set(value);
    this.syncHsvFromRgb();
  }

  protected onAChange(value: number): void {
    this.a.set(value);
    this.syncToStore();
  }

  protected onHslHChange(value: number): void {
    const { s, l } = this.hsla();
    this.applyRgb(hslToRgb({ h: value, s, l }));
  }
  protected onHslSChange(value: number): void {
    const { h, l } = this.hsla();
    this.applyRgb(hslToRgb({ h, s: value, l }));
  }
  protected onHslLChange(value: number): void {
    const { h, s } = this.hsla();
    this.applyRgb(hslToRgb({ h, s, l: value }));
  }

  protected onHexFocus(): void {
    this.isHexEditing = true;
  }

  protected onHexInput(value: string): void {
    this.hexDraft.set(value);
  }

  protected onHexCommit(): void {
    this.isHexEditing = false;
    const value = this.hexDraft();
    if (isValidHex(value)) {
      this.applyHex(value);
      this.syncToStore();
    } else {
      this.hexDraft.set(this.currentColor());
    }
  }

  protected onModeChange(mode: string): void {
    this.mode.set(mode as ColorMode);
  }

  private syncRgbFromHsv(): void {
    const rgb = hsvToRgb({ h: this.h(), s: this.s(), v: this.v() });
    this.r.set(rgb.r);
    this.g.set(rgb.g);
    this.b.set(rgb.b);
    this.syncToStore();
  }

  private syncHsvFromRgb(): void {
    const hsv = rgbToHsv({ r: this.r(), g: this.g(), b: this.b() });
    if (hsv.s > 0 && hsv.v > 0) this.h.set(hsv.h);
    if (hsv.v > 0) this.s.set(hsv.s);
    this.v.set(hsv.v);
    this.syncToStore();
  }

  private applyRgb(rgb: { r: number; g: number; b: number }): void {
    this.r.set(rgb.r);
    this.g.set(rgb.g);
    this.b.set(rgb.b);
    this.syncHsvFromRgb();
  }

  private applyHex(hex: string): void {
    const rgba = hexToRgba(hex);
    const hsva = rgbaToHsva(rgba);
    this.r.set(rgba.r);
    this.g.set(rgba.g);
    this.b.set(rgba.b);
    this.h.set(hsva.h);
    this.s.set(hsva.s);
    this.v.set(hsva.v);
    this.a.set(Math.round(rgba.a));
  }

  private syncToStore(): void {
    this.isInternalUpdate = true;
    this.colorStore.setForeground(this.currentColor());
    queueMicrotask(() => {
      this.isInternalUpdate = false;
    });
  }

  protected onAddToPalette(): void {}
  protected onPickFromCanvas(): void {}
}
