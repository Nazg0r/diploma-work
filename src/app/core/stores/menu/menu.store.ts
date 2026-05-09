import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { updateItemById } from './menu.helpers';
import { initialMenuSlice } from './menu.slice';
import { MenuId } from '../../models/menu.model';

export const MenuStore = signalStore(
  { providedIn: 'root' },
  withState(initialMenuSlice),
  withComputed((store) => {
    return {};
  }),
  withMethods((store) => {
    return {
      open: () => patchState(store, { isOpen: true, openPath: [] }),
      close: () => patchState(store, { isOpen: false }),
      openSubmenu: (itemId: string, depth: number) =>
        patchState(store, { openPath: [...store.openPath().slice(0, depth), itemId] }),
      closeSubmenu: (depth: number) =>
        patchState(store, { openPath: store.openPath().slice(0, depth) }),
      isMenuOpened: (itemId: string, depth: number) => store.openPath()[depth] === itemId,
      registerAction: (itemId: MenuId, action: () => void) =>
        patchState(store, {
          items: updateItemById(store.items(), itemId, (item) => ({ ...item, action })),
        }),
    };
  }),
);
