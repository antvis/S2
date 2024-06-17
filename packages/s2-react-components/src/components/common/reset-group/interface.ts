import type React from 'react';

export interface ResetGroupProps {
  style?: React.CSSProperties;
  className?: string;
  title?: React.ReactNode;
  defaultCollapsed?: boolean;
  onResetClick?: () => void;
  children?: React.ReactNode;
}
