import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { TableSheet } from './table-sheet';
import { SheetComponentsProps } from './interface';
import { PivotSheet } from './pivot-sheet';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import { StrategySheet } from './strategy-sheet';

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
