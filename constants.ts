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
  },
  {
    key: 'qm_bg',
    label: 'QM_BG',
    description: 'QuickMenu/Screnshot3-placeholder background color.'
  },
  {
    key: 'qm_fg',
    label: 'QM_FG',
    description: 'QuickMenu/Screenshot3-placeholder foreground/text color.'
  }
];

export const INITIAL_THEME: EdgeTXTheme = {
  primary1: '#000000',
  primary2: '#F8FCF8',
  primary3: '#083C60',
  secondary1: '#105C98',
  secondary2: '#B0E0F0',
  secondary3: '#E0ECF0',
  focus: '#10A0E0',
  edit: '#009808',
  active: '#F8DC00',
  warning: '#E00000',
  disabled: '#888C88',
  qm_bg: '#000000',
  qm_fg: '#F8FCF8'
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
    disabled: '#444444',
    qm_bg: '#1A1A1A',
    qm_fg: '#FFFFFF'
  }
};