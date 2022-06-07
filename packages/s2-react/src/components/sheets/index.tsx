import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import type { SheetComponentsProps } from './interface';
import { PivotSheet } from './pivot-sheet';
import { StrategySheet } from './strategy-sheet';
import { TableSheet } from './table-sheet';

const Sheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { sheetType } = props;

    const sheetProps: SheetComponentsProps = React.useMemo(() => {
      return {
        ...props,
        getSpreadSheet: (instance) => {
          if (ref) {
            ref.current = instance;
          }
          props.getSpreadSheet?.(instance);
        },
      };
    }, [props, ref]);

    const CurrentSheet = React.useMemo(() => {
      switch (sheetType) {
        case 'table':
          return <TableSheet {...sheetProps} />;
        case 'gridAnalysis':
          return <GridAnalysisSheet {...sheetProps} />;
        case 'strategy':
          return <StrategySheet {...sheetProps} />;
        default:
          return <PivotSheet {...sheetProps} />;
      }
    }, [sheetType, sheetProps]);

    return <React.StrictMode>{CurrentSheet}</React.StrictMode>;
  },
);

Sheet.displayName = 'SheetComponent';

export const SheetComponent: React.ForwardRefExoticComponent<
  SheetComponentsProps & React.RefAttributes<SpreadSheet>
> = React.memo(Sheet);
