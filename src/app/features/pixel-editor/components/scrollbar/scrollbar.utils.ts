import { Size } from '../../../../core/models/canvas.model';
import { ScrollbarState } from '../../../../core/models/scrollbar.model';
import { Viewport } from '../../../../core/models/viewport.model';
import { MIN_SCROLLBAR_SIZE } from '../../constants/scrollbar.constants';

export function calculateHorizontalScrollbar(
  viewport: Viewport,
  canvasSize: Size,
  viewportWidth: number,
): ScrollbarState {
  const canvasWidth = canvasSize.width * viewport.zoom;
  if (canvasWidth < viewportWidth) return { size: 1, position: 0, isVisible: false };

  const size = Math.max(MIN_SCROLLBAR_SIZE, viewportWidth / canvasWidth);
  const position = Math.min(1, Math.max(0, -viewport.offset.x / (canvasWidth - viewportWidth)));

  return { size, position, isVisible: true };
}

export function calculateVerticalScrollbar(
  viewport: Viewport,
  canvasSize: Size,
  viewportHeight: number,
): ScrollbarState {
  const canvasHeight = canvasSize.height * viewport.zoom;
  if (canvasHeight < viewportHeight) return { size: 1, position: 0, isVisible: false };

  const size = Math.max(MIN_SCROLLBAR_SIZE, viewportHeight / canvasHeight);
  const position = Math.min(1, Math.max(0, -viewport.offset.y / (canvasHeight - viewportHeight)));

  return { size, position, isVisible: true };
}

export function positionToOffset(position: number, canvasSize: number, viewportSize: number): number {
  return -(position * (canvasSize - viewportSize));
}
