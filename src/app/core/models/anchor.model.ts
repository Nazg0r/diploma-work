import { PanelAnchor } from './panel.model';

export type AnchorPositioning = 'top-left' | 'top-right' | 'bottom-center';
export type FlexDirection = 'row' | 'row-reverse';
export type ArrowDirection = 'down' | 'up' | 'right' | 'left';

export interface AnchorMeta {
  positioning: AnchorPositioning;
  headerFlexDirection: FlexDirection;
  centered: boolean;
  hiddenArrowDirection: ArrowDirection;
  expandedArrowDirection: ArrowDirection;
}

export const ANCHOR_META: Record<PanelAnchor, AnchorMeta> = {
  right: {
    positioning: 'top-right',
    headerFlexDirection: 'row',
    centered: false,
    hiddenArrowDirection: 'right',
    expandedArrowDirection: 'down',
  },
  left: {
    positioning: 'top-left',
    headerFlexDirection: 'row-reverse',
    centered: false,
    hiddenArrowDirection: 'left',
    expandedArrowDirection: 'down',
  },
  bottom: {
    positioning: 'bottom-center',
    headerFlexDirection: 'row',
    centered: true,
    hiddenArrowDirection: 'up',
    expandedArrowDirection: 'down',
  },
  none: {
    positioning: 'top-left',
    headerFlexDirection: 'row',
    centered: false,
    hiddenArrowDirection: 'down',
    expandedArrowDirection: 'down',
  },
};

export const ARROW_ROTATION: Record<ArrowDirection, number> = {
  down: 0,
  up: 180,
  right: 90,
  left: -90,
};
