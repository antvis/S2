import { type ViewMeta } from '@antv/s2';
import { isEmpty, size } from 'lodash';
import React from 'react';
import { customMerge, Node, SpreadSheet, type ColHeaderConfig } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
import type { HeaderBaseProps } from '../../header';
import { strategyCopy } from '../../export/strategy-copy';
import { StrategySheetColCell, StrategySheetDataCell } from './custom-cell';
import { StrategySheetDataSet } from './custom-data-set';
import {
  StrategySheetColCellTooltip,
  StrategySheetDataCellTooltip,
  StrategySheetRowCellTooltip,
} from './custom-tooltip';

/**
 * 趋势分析表特性：
 * 1. 维度为空时默认为自定义目录树结构
 * 2. 单指标时数值置于列头，且隐藏指标列头
 * 3. 多指标时数值置于行头，不隐藏指标列头
 * 4. 支持 KPI 进度 (子弹图)
 * 5. 行头, 数值单元格不支持多选
 */
export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, themeCfg, dataCfg, ...restProps } = props;

    const strategySheetOptions =
      React.useMemo<SheetComponentOptions | null>(() => {
        if (isEmpty(dataCfg)) {
          return null;
        }

        // 单指标非自定义树结构隐藏指标列
        const shouldHideValue = size(dataCfg?.fields?.values) === 1;

        return {
          hierarchyType: 'tree',
          dataCell: (viewMeta: ViewMeta) =>
            new StrategySheetDataCell(viewMeta, viewMeta.spreadsheet),
          colCell: (
            node: Node,
            spreadsheet: SpreadSheet,
            headerConfig: ColHeaderConfig,
          ) => new StrategySheetColCell(node, spreadsheet, headerConfig),
          dataSet: (spreadSheet: SpreadSheet) =>
            new StrategySheetDataSet(spreadSheet),
          showDefaultHeaderActionIcon: false,
          style: {
            colCell: {
              hideValue: shouldHideValue,
            },
          },
          interaction: {
            autoResetSheetStyle: true,
            // 趋势分析表禁用 刷选, 多选, 区间多选
            brushSelection: false,
            selectedCellMove: false,
            multiSelection: false,
            rangeSelection: false,
          },
          tooltip: {
            operation: {
              hiddenColumns: true,
            },
            rowCell: {
              content: (cell) => <StrategySheetRowCellTooltip cell={cell} />,
            },
            colCell: {
              content: (cell) => <StrategySheetColCellTooltip cell={cell} />,
            },
            dataCell: {
              content: (cell) => <StrategySheetDataCellTooltip cell={cell} />,
            },
          },
        };
      }, [dataCfg]);

    const s2Options = React.useMemo<SheetComponentOptions>(
      () => customMerge<SheetComponentOptions>(strategySheetOptions, options),
      [options, strategySheetOptions],
    );

    const header: Partial<HeaderBaseProps> = {
      export: {
        // 趋势分析表使用定制的复制导出处理逻辑
        customCopyMethod: strategyCopy,
      },
    };

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={themeCfg}
        dataCfg={dataCfg}
        {...restProps}
        header={customMerge(restProps?.header, header)}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
