import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { ModalRef } from '../models/modals';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private modalsStack: Array<{
    componentRef: ComponentRef<unknown>;
    resolve: (value: unknown) => void;
  }> = [];

  constructor() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.modalsStack.length > 0) {
        this.modalsStack[this.modalsStack.length - 1].resolve(undefined);
        this.detachTop();
      }
    });
  }

  public open<TData, TResult>(
    component: Type<unknown>,
    data?: TData,
    injector?: Injector,
  ): ModalRef<TResult> {
    let resolveAfterClosed: (result: TResult | undefined) => void;
    const afterClosed = new Promise<TResult | undefined>((resolve) => {
      resolveAfterClosed = resolve;
    });

    const componentRef = createComponent(component, {
      environmentInjector: this.injector,
      elementInjector: injector,
    });

    const modalRef: ModalRef<TResult> = {
      close: (result?: TResult) => {
        resolveAfterClosed(result);
        this.detach(componentRef);
      },
      afterClosed,
    };

    if (data !== undefined) {
      componentRef.setInput('data', data);
    }
    componentRef.setInput('modalRef', modalRef);

    document.body.appendChild(componentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);

    this.modalsStack.push({
      componentRef,
      resolve: resolveAfterClosed! as (value: unknown) => void,
    });

    return modalRef;
  }

  private detach(componentRef: ComponentRef<unknown>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    this.modalsStack = this.modalsStack.filter((entry) => entry.componentRef !== componentRef);
  }

  private detachTop(): void {
    const top = this.modalsStack.pop();
    if (top) {
      this.appRef.detachView(top.componentRef.hostView);
      top.componentRef.destroy();
    }
  }
}
