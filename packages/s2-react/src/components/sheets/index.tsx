import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { getLang } from '@antv/s2';
import { ConfigProvider } from 'antd';
import { SpreadSheetContext } from '../../context/SpreadSheetContext';
import { EditableSheet } from './editable-sheet';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import type { SheetComponentsProps } from './interface';
import { PivotSheet } from './pivot-sheet';
import { StrategySheet } from './strategy-sheet';
import { TableSheet } from './table-sheet';
import { ChartSheet } from './chart-sheet';

const Sheet = React.forwardRef<SpreadSheet, SheetComponentsProps>(
  (props, ref) => {
    const { sheetType } = props;

    const [s2Instance, setS2Instance] = React.useState<SpreadSheet | null>(
      null,
    );
    const sheetProps = React.useMemo<SheetComponentsProps>(() => {
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

    const locale = getLang() === 'zh_CN' ? zhCN : enUS;

    return (
      <React.StrictMode>
        <SpreadSheetContext.Provider value={s2Instance!}>
          <ConfigProvider locale={locale}>{CurrentSheet}</ConfigProvider>
        </SpreadSheetContext.Provider>
      </React.StrictMode>
    );
  },
);

export const SheetComponent: React.ForwardRefExoticComponent<
  SheetComponentsProps & React.RefAttributes<SpreadSheet>
> = React.memo(Sheet);

SheetComponent.displayName = 'SheetComponent';
