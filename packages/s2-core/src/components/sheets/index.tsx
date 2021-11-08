import React from 'react';
import type { SpreadSheet } from '../../sheet-type/spread-sheet';
import { BaseSheet } from './base-sheet';
import { TabularSheet } from './tabular-sheet';
import { TableSheet } from './table-sheet';
import type { SpreadsheetProps } from './interface';

const Sheet = React.forwardRef(
  (props: SpreadsheetProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { sheetType, ...otherProps } = props;
    const sheetProps: SpreadsheetProps = {
      ...otherProps,
      getSpreadSheet: (instance) => {
        if (ref) {
          ref.current = instance;
        }
        otherProps.getSpreadSheet?.(instance);
      },
    };

    switch (sheetType) {
      case 'table':
        return <TableSheet {...sheetProps} />;
      case 'tabular':
        return <TabularSheet {...sheetProps} />;
      default:
        return <BaseSheet {...sheetProps} />;
    }
  },
);

Sheet.displayName = 'SheetComponent';

export const SheetComponent: React.ForwardRefExoticComponent<
  SpreadsheetProps & React.RefAttributes<SpreadSheet>
> = React.memo(Sheet);
