import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { SpreadSheetContext } from '../../context/SpreadSheetContext';
import { ChartSheet } from './chart-sheet';
import { EditableSheet } from './editable-sheet';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import type { SheetComponentProps } from './interface';
import { PivotChartSheet } from './pivot-chart-sheet';
import { PivotSheet } from './pivot-sheet';
import { StrategySheet } from './strategy-sheet';
import { TableSheet } from './table-sheet';

const Sheet = React.forwardRef<SpreadSheet, SheetComponentProps>(
  (props, ref) => {
    const { sheetType } = props;

    const [s2Instance, setS2Instance] = React.useState<SpreadSheet | null>(
      null,
    );
    const sheetProps = React.useMemo<SheetComponentProps>(() => {
      return {
        ...props,
        onMounted: (instance) => {
          if (ref) {
            (ref as React.MutableRefObject<SpreadSheet>).current = instance;
          }

          setS2Instance(instance);
          props.onMounted?.(instance);
        },
      };
    }, [props, ref]);

    const CurrentSheet = React.useMemo(() => {
      switch (sheetType) {
        case 'table':
          return <TableSheet {...sheetProps} />;
        case 'chart':
          return <ChartSheet {...sheetProps} />;
        case 'pivotChart':
          return <PivotChartSheet {...sheetProps} />;
        case 'gridAnalysis':
          return <GridAnalysisSheet {...sheetProps} />;
        case 'strategy':
          return <StrategySheet {...sheetProps} />;
        case 'editable':
          return <EditableSheet {...sheetProps} />;
        default:
          return <PivotSheet {...sheetProps} />;
      }
    }, [sheetType, sheetProps]);

    return (
      <SpreadSheetContext.Provider value={s2Instance!}>
        {CurrentSheet}
      </SpreadSheetContext.Provider>
    );
  },
);

export const SheetComponent: React.ForwardRefExoticComponent<SheetComponentProps> =
  React.memo(Sheet) as React.ForwardRefExoticComponent<SheetComponentProps>;

SheetComponent.displayName = 'SheetComponent';
