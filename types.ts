
export interface EdgeTXTheme {
  primary1: string;
  primary2: string;
  primary3: string;
  secondary1: string;
  secondary2: string;
  secondary3: string;
  focus: string;
  edit: string;
  active: string;
  warning: string;
  disabled: string;
}

export type ThemeVariable = keyof EdgeTXTheme;

export interface VariableMeta {
  key: ThemeVariable;
  label: string;
  description: string;
}

export interface ThemeMetadata {
  name: string;
  author: string;
  info: string;
}

/**
 * Interface for tracking theme modification history.
 * Fixes: "Module '"../types"' has no exported member 'HistoryEntry'" error.
 */
export interface HistoryEntry {
  theme: EdgeTXTheme;
  timestamp: number;
  label: string;
}
