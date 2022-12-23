import type { S2CellType } from '@antv/s2';
import {
  type ColHeaderConfig,
  customMerge,
  Node,
  type S2Options,
  SpreadSheet,
  type ViewMeta,
  type MultiData,
  type TooltipShowOptions,
} from '@antv/s2';
import { isArray, isEmpty, isFunction, isNil, size } from 'lodash';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
import { CustomColCell } from './custom-col-cell';
import { CustomDataCell } from './custom-data-cell';
import { StrategyDataSet } from './custom-data-set';
import {
  StrategySheetColTooltip,
  StrategySheetDataTooltip,
  StrategySheetRowTooltip,
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
    const s2Ref = React.useRef<SpreadSheet | null>(null);

    const strategySheetOptions =
      React.useMemo<S2Options<React.ReactNode> | null>(() => {
        if (isEmpty(dataCfg)) {
          return null;
        }

        // 单指标非自定义树结构隐藏指标列
        const hideMeasureColumn = size(dataCfg?.fields?.values) === 1;

        const getContent =
          (cellType: 'rowCell' | 'colCell' | 'dataCell') =>
          (
            cell: S2CellType,
            tooltipOptions: TooltipShowOptions<React.ReactNode>,
          ): React.ReactNode => {
            // 优先级: 单元格 > 表格级
            const tooltipContent: TooltipShowOptions<React.ReactNode>['content'] =
              options?.tooltip?.[cellType]?.content ??
              options?.tooltip?.content;

            const content = isFunction(tooltipContent)
              ? tooltipContent?.(cell, tooltipOptions)
              : tooltipContent;

            return content;
          };

        return {
          hierarchyType: 'tree',
          dataCell: (viewMeta: ViewMeta) =>
            new CustomDataCell(viewMeta, viewMeta.spreadsheet),
          colCell: (
            node: Node,
            spreadsheet: SpreadSheet,
            headerConfig: ColHeaderConfig,
          ) => new CustomColCell(node, spreadsheet, headerConfig),
          dataSet: (spreadSheet: SpreadSheet) =>
            new StrategyDataSet(spreadSheet),
          showDefaultHeaderActionIcon: false,
          style: {
            colCell: {
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
            rowCell: {
              content: (cell, tooltipOptions) =>
                getContent('rowCell')(cell, tooltipOptions) ?? (
                  <StrategySheetRowTooltip cell={cell} />
                ),
            },
            colCell: {
              content: (cell, tooltipOptions) =>
                getContent('colCell')(cell, tooltipOptions) ?? (
                  <StrategySheetColTooltip cell={cell} />
                ),
            },
            dataCell: {
              content: (cell, tooltipOptions) => {
                const meta = cell.getMeta() as ViewMeta;
                const fieldValue = meta.fieldValue as MultiData;
                const content = getContent('dataCell')(cell, tooltipOptions);

                // 自定义内容优先级最高
                if (!isNil(content)) {
                  return content;
                }

                // 如果是数组, 说明是普通数值+同环比数据, 显示普通数值 Tooltip
                if (isArray(fieldValue?.values)) {
                  return <StrategySheetDataTooltip cell={cell} />;
                }

                return <></>;
              },
            },
          },
        };
      }, [dataCfg, options?.tooltip]);

    const s2Options = React.useMemo<SheetComponentOptions>(() => {
      return customMerge(options, strategySheetOptions);
    }, [options, strategySheetOptions]);

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={themeCfg}
        dataCfg={dataCfg}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
