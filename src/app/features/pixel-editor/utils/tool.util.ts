import { Vector2 } from '../../../core/models/canvas.model';
import { RGBA } from '../../../core/models/palette/color.model';

export function getBrushPoints(center: Vector2, size: number): Vector2[] {
  const points: Vector2[] = [];
  const half = Math.floor(size / 2);

  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      points.push({
        x: center.x - half + dx,
        y: center.y - half + dy,
      });
    }
  }

  return points;
}

export function bresenhamLine(from: Vector2, to: Vector2): Vector2[] {
  const points: Vector2[] = [];
  let { x: x0, y: y0 } = from;
  const { x: x1, y: y1 } = to;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}

export function hexToRgba(hex: string, opacity = 1): RGBA {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  const a = Math.round(opacity * 255);
  return {r, g, b, a};
}

export function applyPerfectPixel(points: Vector2[]): Vector2[] {
  if (points.length < 3) return points;

  const result: Vector2[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const next = points[i + 1];

    const orthoToPrev = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y) === 1;
    const orthoToNext = Math.abs(curr.x - next.x) + Math.abs(curr.y - next.y) === 1;
    const prevNextDiagonal = Math.abs(prev.x - next.x) === 1 && Math.abs(prev.y - next.y) === 1;

    const isLCorner = orthoToPrev && orthoToNext && prevNextDiagonal;

    if (!isLCorner) {
      result.push(curr);
    }
  }

  result.push(points[points.length - 1]);
  return result;
}

