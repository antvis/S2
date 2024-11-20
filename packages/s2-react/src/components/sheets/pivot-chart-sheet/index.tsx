import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentProps } from '../interface';

export const PivotChartSheet: React.FC<SheetComponentProps> = React.memo(
  (props) => {
    return <BaseSheet {...props} />;
  },
);

PivotChartSheet.displayName = 'PivotChartSheet';
