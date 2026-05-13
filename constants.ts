import { VariableMeta, EdgeTXTheme } from './types.ts';

export const VARIABLE_METADATA: VariableMeta[] = [
  {
    key: 'primary1',
    label: 'PRIMARY1',
    description: 'Main static text (menu names, labels) and divider lines between rows.'
  },
  {
    key: 'primary2',
    label: 'PRIMARY2',
    description: 'Bar background (Top bar with clock/battery, Menu headers) and scroll bars.'
  },
  {
    key: 'primary3',
    label: 'PRIMARY3',
    description: 'Standard key background and menu icons (e.g., icons on the SYS page).'
  },
  {
    key: 'secondary1',
    label: 'SECONDARY1',
    description: 'Dynamic values text (telemetry numbers, channel percentages, channel names).'
  },
  {
    key: 'secondary2',
    label: 'SECONDARY2',
    description: 'Secondary labels and short descriptions under main titles.'
  },
  {
    key: 'secondary3',
    label: 'SECONDARY3',
    description: 'General screen background (the "empty" area behind everything else).'
  },
  {
    key: 'focus',
    label: 'FOCUS',
    description: 'Selection cursor: the color of the rectangle indicating your position.'
  },
  {
    key: 'edit',
    label: 'EDIT',
    description: 'Field being edited: the color that appears when you press the scroll wheel to change a value.'
  },
  {
    key: 'active',
    label: 'ACTIVE',
    description: 'ON state: color of active checkboxes, "on" logic switches, and status indicators.'
  },
  {
    key: 'warning',
    label: 'WARNING',
    description: 'Alarms: error text, safety warnings (stick not at zero), and danger icons.'
  },
  {
    key: 'disabled',
    label: 'DISABLED',
    description: 'Functions not available: text or icons of options that cannot be clicked.'
  }
];

export const INITIAL_THEME: EdgeTXTheme = {
  primary1: '#000000',
  primary2: '#FFFFFF',
  primary3: '#E00000',
  secondary1: '#474747',
  secondary2: '#8C8C8C',
  secondary3: '#DBDBDB',
  focus: '#93D400',
  edit: '#8C8C8C',
  active: '#FFC800',
  warning: '#A30000',
  disabled: '#000000'
};

export const PRESETS: Record<string, EdgeTXTheme> = {
  "User Template": INITIAL_THEME,
  "EdgeTX Dark": {
    primary1: '#FFFFFF',
    primary2: '#21409A',
    primary3: '#333333',
    secondary1: '#00FF00',
    secondary2: '#AAAAAA',
    secondary3: '#121212',
    focus: '#FFB400',
    edit: '#00D4FF',
    active: '#4CAF50',
    warning: '#F44336',
    disabled: '#444444'
  }
};