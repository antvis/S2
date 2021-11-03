import React from 'react';
import debounceRender from 'react-debounce-render';
import type { SpreadSheet } from '../../sheet-type/spread-sheet';
import { BaseSheet } from './base-sheet';
import { TabularSheet } from './tabular-sheet';
import { TableSheet } from './table-sheet';
import type { SpreadsheetProps } from './interface';

const Sheet: React.FC<SpreadsheetProps> = React.memo(
  React.forwardRef(
    (props: SpreadsheetProps, ref: React.MutableRefObject<SpreadSheet>) => {
      const { sheetType, ...restProps } = props;
      const sheetProps: SpreadsheetProps = {
        ...restProps,
        getSpreadsheet: (instance) => {
          if (ref) {
            ref.current = instance;
          }
          restProps.getSpreadsheet?.(instance);
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
  ),
);

Sheet.displayName = 'Sheet';

export const SheetComponent: React.FC<SpreadsheetProps> = debounceRender(
  Sheet,
  100,
);
