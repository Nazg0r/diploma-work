import { MenuItemState } from '../../models/menu.model';

export interface MenuSlice {
  isOpen: boolean;
  openPath: string[];
  items: MenuItemState[];
}

export const initialMenuSlice: MenuSlice = {
  isOpen: false,
  openPath: [],
  items: [
    {
      id: 'file',
      label: 'File',
      children: [
        {
          id: 'file/create-new',
          label: 'Create New',
          children: [
            {
              id: 'file/create-new/sprite',
              label: 'Sprite',
              shortcut: 'Ctrl+N+S',
            },
            {
              id: 'file/create-new/map',
              label: 'Map',
              shortcut: 'Ctrl+N+M',
            },
          ],
        },
        {
          id: 'file/open',
          label: 'Open',
          dividerAfter: true,
          children: [
            {
              id: 'file/open/sprite',
              label: 'Sprite',
            },
            {
              id: 'file/open/map',
              label: 'Map',
            },
          ],
        },
        {
          id: 'file/save',
          label: 'Save',
          shortcut: 'Ctrl+S',
        },
        {
          id: 'file/save-as',
          label: 'Save As...',
          shortcut: 'Shift+Ctrl+S',
          dividerAfter: true,
        },
        {
          id: 'file/import',
          label: 'Import',
        },
        {
          id: 'file/export',
          label: 'Export',
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      children: [
        {
          id: 'edit/undo',
          label: 'Undo',
          shortcut: 'Ctrl+Z',
        },
        {
          id: 'edit/redo',
          label: 'Redo',
          dividerAfter: true,
          shortcut: 'Ctrl+Y',
        },
        {
          id: 'edit/history',
          label: 'History',
          shortcut: 'Ctrl+H',
        },
        {
          id: 'edit/hot-keys',
          label: 'Hot Keys',
        },
        {
          id: 'edit/preferences',
          label: 'Preferences',
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      children: [
        {
          id: 'view/mode',
          label: 'Mode',
        },
        {
          id: 'view/grid',
          label: 'Grid',
          shortcut: 'Ctrl+G',
        },
        {
          id: 'view/minimize',
          label: 'Minimize',
        },
        {
          id: 'view/show',
          label: 'Show',
        },
      ],
    },
    {
      id: 'sprite',
      label: 'Sprite',
      children: [
        {
          id: 'sprite/create-new',
          label: 'Create New',
          shortcut: 'Shift+Ctrl+S',
        },
        {
          id: 'sprite/load',
          label: 'Load',
        },
        {
          id: 'sprite/save',
          label: 'Save',
        },
        {
          id: 'sprite/duplicate',
          label: 'Duplicate',
        },
        {
          id: 'sprite/resize',
          label: 'Resize',
        },
        {
          id: 'sprite/crop',
          label: 'Crop',
        },
        {
          id: 'sprite/rotate',
          label: 'Rotate',
        },
        {
          id: 'sprite/delete',
          label: 'Delete',
        },
      ],
    },
    {
      id: 'map',
      label: 'Map',
      children: [
        {
          id: 'map/create-new',
          label: 'Create New',
          shortcut: 'Shift+Ctrl+M',
        },
        {
          id: 'map/load',
          label: 'Load',
        },
        {
          id: 'map/save',
          label: 'Save',
        },
        {
          id: 'map/resize',
          label: 'Resize',
        },
        {
          id: 'map/tile-size',
          label: 'Tile Size',
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      isDisabled: true,
      children: [
        {
          id: 'help/documentation',
          label: 'Documentation',
        },
        {
          id: 'help/tutorial',
          label: 'Tutorial',
        },
        {
          id: 'help/support',
          label: 'Support',
        },
        {
          id: 'help/report-a-bug',
          label: 'Report a Bug',
        },
        {
          id: 'help/about',
          label: 'About',
        },
      ],
    },
  ],
};
