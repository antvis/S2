import type { SpreadSheet } from '@antv/s2';
import { getLang } from '@antv/s2';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import ru from 'antd/es/locale/ru_RU';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
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
        onMounted: (instance) => {
          if (ref) {
            ref.current = instance;
          }
          props.onMounted?.(instance);
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

    const lang = getLang();
    // eslint-disable-next-line no-nested-ternary
    const locale = lang === 'zh_CN' ? zhCN : lang === 'ru' ? ru : enUS;

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
