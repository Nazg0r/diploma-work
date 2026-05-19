import { HSL, HSLA, HSV, HSVA, RGB, RGBA } from '../../../core/models/palette/color.model';

export function hexToRgb(hex: string): RGB {
  const cleaned = normalizeHex(hex).slice(1);
  const rgb = cleaned.length === 8 ? cleaned.substring(0, 6) : cleaned;

  if (rgb.length !== 6) return { r: 0, g: 0, b: 0 };

  return {
    r: parseInt(rgb.substring(0, 2), 16),
    g: parseInt(rgb.substring(2, 4), 16),
    b: parseInt(rgb.substring(4, 6), 16),
  };
}

export function hexToRgba(hex: string): RGBA {
  const cleaned = normalizeHex(hex).slice(1);
  const expanded = cleaned.length === 6 ? cleaned + 'ff' : cleaned;

  if (expanded.length !== 8) return { r: 0, g: 0, b: 0, a: 1 };

  return {
    r: parseInt(expanded.substring(0, 2), 16),
    g: parseInt(expanded.substring(2, 4), 16),
    b: parseInt(expanded.substring(4, 6), 16),
    a: parseInt(expanded.substring(6, 8), 16),
  };
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

export function isValidHex(value: string): boolean {
  return /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim());
}

export function normalizeHex(value: string): string {
  if (!isValidHex(value)) return '#000000';

  let cleaned = value.replace('#', '').trim().toLowerCase();

  if (cleaned.length === 3 || cleaned.length === 4) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }

  return `#${cleaned}`;
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(max * 100),
  };
}

export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbaToHex({ r, g, b, a }: RGBA): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function hexToHsv(hex: string): HSV {
  return rgbToHsv(hexToRgb(hex));
}

export function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv));
}

export function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  return { ...rgbToHsv({ r, g, b }), a };
}

export function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  return { ...hsvToRgb({ h, s, v }), a };
}

export function rgbaToHsla({ r, g, b, a }: RGBA): HSLA {
  return { ...rgbToHsl({ r, g, b }), a };
}

export function hslaToRgba({ h, s, l, a }: HSLA): RGBA {
  return { ...hslToRgb({ h, s, l }), a };
}

export function hsvaToHsla(hsva: HSVA): HSLA {
  return rgbaToHsla(hsvaToRgba(hsva));
}

export function hslaToHsva(hsla: HSLA): HSVA {
  return rgbaToHsva(hslaToRgba(hsla));
}

export function hexToHsva(hex: string): HSVA {
  return rgbaToHsva(hexToRgba(hex));
}

export function hsvaToHex(hsva: HSVA): string {
  return rgbaToHex(hsvaToRgba(hsva));
}

export function hexToHsla(hex: string): HSLA {
  return rgbaToHsla(hexToRgba(hex));
}

export function hslaToHex(hsla: HSLA): string {
  return rgbaToHex(hslaToRgba(hsla));
}

function toHex(value: number): string {
  const normalized = Math.max(0, Math.min(255, Math.round(value)));

  return normalized.toString(16).padStart(2, '0');
}
