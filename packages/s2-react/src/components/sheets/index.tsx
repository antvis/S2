import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { BaseSheet } from './base-sheet';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import { TableSheet } from './table-sheet';
import { SheetComponentsProps } from './interface';
import { PivotSheet } from './pivot-sheet';

const Sheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { sheetType, ...otherProps } = props;

    const sheetProps: SheetComponentsProps = React.useMemo(() => {
      return {
        ...otherProps,
        getSpreadSheet: (instance) => {
          if (ref) {
            ref.current = instance;
          }
          otherProps.getSpreadSheet?.(instance);
        },
      };
    }, [otherProps, ref]);

    const CurrentSheet = React.useMemo(() => {
      switch (sheetType) {
        case 'table':
          return <TableSheet {...sheetProps} />;
        case 'gridAnalysis':
          return <GridAnalysisSheet {...sheetProps} />;
        case 'pivot':
          return <PivotSheet {...sheetProps} />;
        default:
          return <BaseSheet {...sheetProps} />;
      }
    }, [sheetType, sheetProps]);

    return <React.StrictMode>{CurrentSheet}</React.StrictMode>;
  },
);

Sheet.displayName = 'SheetComponent';

export const SheetComponent: React.ForwardRefExoticComponent<
  SheetComponentsProps & React.RefAttributes<SpreadSheet>
> = React.memo(Sheet);
