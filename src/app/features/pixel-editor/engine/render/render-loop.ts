export class RenderLoop {
  private isDirty = false;
  private frameId: number | null = null;

  constructor(private readonly onRender: () => void) {}

  public markDirty() {
    if (this.isDirty) return;
    this.isDirty = true;
    this.frameId = window.requestAnimationFrame(() => {
      this.isDirty = false;
      this.frameId = null;
      this.onRender();
    });
  }

  public dispose(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}
