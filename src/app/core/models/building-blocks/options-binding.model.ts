export interface OptionsBinding {
  option: string;
  isDisabled?: boolean;
  action: (event?: PointerEvent) => void;
}
