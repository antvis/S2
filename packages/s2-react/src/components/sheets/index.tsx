import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { getLang } from '@antv/s2';
import { ConfigProvider } from 'antd';
import { EditableSheet } from './editable-sheet';
import { GridAnalysisSheet } from './grid-analysis-sheet';
import type { SheetComponentsProps } from './interface';
import { PivotSheet } from './pivot-sheet';
import { StrategySheet } from './strategy-sheet';
import { TableSheet } from './table-sheet';

const Sheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { sheetType } = props;

    const sheetProps = React.useMemo<SheetComponentsProps>(() => {
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
        case 'editable':
          return <EditableSheet {...sheetProps} />;
        default:
          return <PivotSheet {...sheetProps} />;
      }
    }, [sheetType, sheetProps]);

    const locale = getLang() === 'zh_CN' ? zhCN : enUS;

    return (
      <React.StrictMode>
        <ConfigProvider locale={locale}>{CurrentSheet}</ConfigProvider>
      </React.StrictMode>
    );
  },
);

export const SheetComponent: React.ForwardRefExoticComponent<
  SheetComponentsProps & React.RefAttributes<SpreadSheet>
> = React.memo(Sheet);

SheetComponent.displayName = 'SheetComponent';
