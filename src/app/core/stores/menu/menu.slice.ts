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
          id: 'create-new',
          label: 'Create New',
          children: [
            {
              id: 'sprite',
              label: 'Sprite',
              shortcut: 'Ctrl+N+S',
            },
            {
              id: 'map',
              label: 'Map',
              shortcut: 'Ctrl+N+M',
            },
          ],
        },
        {
          id: 'open',
          label: 'Open',
          dividerAfter: true,
          children: [
            {
              id: 'sprite',
              label: 'Sprite',
            },
            {
              id: 'map',
              label: 'Map',
            },
          ],
        },
        {
          id: 'save',
          label: 'Save',
          shortcut: 'Ctrl+S',
        },
        {
          id: 'save-as',
          label: 'Save As...',
          shortcut: 'Shift+Ctrl+S',
          dividerAfter: true,
        },
        {
          id: 'import',
          label: 'Import',
        },
        {
          id: 'export',
          label: 'Export',
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      children: [
        {
          id: 'undo',
          label: 'Undo',
          shortcut: 'Ctrl+Z',
        },
        {
          id: 'redo',
          label: 'Redo',
          dividerAfter: true,
          shortcut: 'Ctrl+Y',
        },
        {
          id: 'history',
          label: 'History',
          shortcut: 'Ctrl+H',
        },
        {
          id: 'hot-keys',
          label: 'Hot Keys',
        },
        {
          id: 'preferences',
          label: 'Preferences',
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      children: [
        {
          id: 'mode',
          label: 'Mode',
        },
        {
          id: 'grid',
          label: 'Grid',
          shortcut: 'Ctrl+G',
        },
        {
          id: 'minimalize',
          label: 'Minimize',
        },
        {
          id: 'show',
          label: 'Show',
        },
      ],
    },
    {
      id: 'sprite',
      label: 'Sprite',
      children: [
        {
          id: 'create-new',
          label: 'Create New',
          shortcut: 'Shift+Ctrl+S',
        },
        {
          id: 'load',
          label: 'Load',
        },
        {
          id: 'save',
          label: 'Save',
        },
        {
          id: 'duplicate',
          label: 'Duplicate',
        },
        {
          id: 'resize',
          label: 'Resize',
        },
        {
          id: 'crop',
          label: 'Crop',
        },
        {
          id: 'rotate',
          label: 'Rotate',
        },
        {
          id: 'delete',
          label: 'Delete',
        },
      ],
    },
    {
      id: 'map',
      label: 'Map',
      children: [
        {
          id: 'create-new',
          label: 'Create New',
          shortcut: 'Shift+Ctrl+M',
        },
        {
          id: 'load',
          label: 'Load',
        },
        {
          id: 'save',
          label: 'Save',
        },
        {
          id: 'resize',
          label: 'Resize',
        },
        {
          id: 'tile-size',
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
          id: 'documentation',
          label: 'Documentation',
        },
        {
          id: 'tutorial',
          label: 'Tutorial',
        },
        {
          id: 'support',
          label: 'Support',
        },
        {
          id: 'report-a-bug',
          label: 'Report a Bug',
        },
        {
          id: 'about',
          label: 'About',
        },
      ],
    },
  ],
};
