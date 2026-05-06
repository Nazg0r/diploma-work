export interface ModalRef<TResult = unknown> {
  close(result?: TResult): void;
  readonly afterClosed: Promise<TResult | undefined>;
}
