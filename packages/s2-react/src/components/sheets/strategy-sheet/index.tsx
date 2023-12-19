<<<<<<< HEAD
import {
  customMerge,
  Node,
  SpreadSheet,
  type ColHeaderConfig,
=======
import type { S2CellType, S2DataConfig } from '@antv/s2';
import {
  Node,
  SpreadSheet,
  customMerge,
  type ColHeaderConfig,
  type MultiData,
  type S2Options,
  type TooltipShowOptions,
>>>>>>> origin/master
  type ViewMeta,
} from '@antv/s2';
import { isEmpty, size } from 'lodash';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
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

<<<<<<< HEAD
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
=======
      // 单指标非自定义树结构隐藏指标列
      if (
        size(dataCfg?.fields?.values) === 1 &&
        options.hierarchyType !== 'customTree'
      ) {
        hideMeasureColumn = true;
      }

      const getContent =
        (cellType: 'row' | 'col' | 'data') =>
        (
          cell: S2CellType,
          tooltipOptions: TooltipShowOptions<React.ReactNode>,
        ): React.ReactNode => {
          // 优先级: 单元格 > 表格级
          const tooltipContent: TooltipShowOptions<React.ReactNode>['content'] =
            options.tooltip?.[cellType]?.content ?? options.tooltip?.content;

          const content = isFunction(tooltipContent)
            ? tooltipContent?.(cell, tooltipOptions)
            : tooltipContent;

          return content;
        };

      return {
        dataCell: (viewMeta: ViewMeta) =>
          new CustomDataCell(viewMeta, viewMeta.spreadsheet),
        colCell: (
          node: Node,
          spreadsheet: SpreadSheet,
          headerConfig: ColHeaderConfig,
        ) => new CustomColCell(node, spreadsheet, headerConfig),
        dataSet: (spreadSheet: SpreadSheet) => new StrategyDataSet(spreadSheet),
        showDefaultHeaderActionIcon: false,
        hierarchyType,
        style: {
          colCfg: {
            hideMeasureColumn,
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
          row: {
            content: (cell, tooltipOptions) =>
              getContent('row')(cell, tooltipOptions) ?? (
                <StrategySheetRowTooltip cell={cell} />
              ),
          },
          col: {
            content: (cell, tooltipOptions) =>
              getContent('col')(cell, tooltipOptions) ?? (
                <StrategySheetColTooltip cell={cell} />
              ),
          },
          data: {
            content: (cell, tooltipOptions) => {
              const meta = cell.getMeta() as ViewMeta;
              const fieldValue = meta.fieldValue as MultiData;
              const content = getContent('data')(cell, tooltipOptions);

              // 自定义内容优先级最高
              if (!isNil(content)) {
                return content;
              }

              // 如果是数组, 说明是普通数值+同环比数据, 显示普通数值 Tooltip
              if (isArray(fieldValue?.values)) {
                return <StrategySheetDataTooltip cell={cell} />;
              }

              return <></>;
>>>>>>> origin/master
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

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={themeCfg}
        dataCfg={dataCfg}
        {...restProps}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
