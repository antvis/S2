import type { S2CellType, S2DataConfig } from '@antv/s2';
import {
  Node,
  SpreadSheet,
  customMerge,
  type ColHeaderConfig,
  type MultiData,
  type S2Options,
  type TooltipShowOptions,
  type ViewMeta,
} from '@antv/s2';
import { isArray, isEmpty, isFunction, isNil, size } from 'lodash';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
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
    const s2Ref = React.useRef<SpreadSheet>();

    const strategySheetOptions = React.useMemo<
      S2Options<React.ReactNode>
    >(() => {
      if (isEmpty(dataCfg)) {
        return {};
      }
      let hideMeasureColumn = false;
      let hierarchyType: S2Options['hierarchyType'] = 'tree';

      // 根据 dataConfig 切换 hierarchyType
      if (
        isEmpty(dataCfg?.fields?.rows) &&
        !isEmpty(dataCfg?.fields?.customTreeItems)
      ) {
        hierarchyType = 'customTree';
      }

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
            },
          },
        },
      };
    }, [dataCfg, options.hierarchyType, options.tooltip]);

    const s2DataCfg = React.useMemo<S2DataConfig>(() => {
      const defaultFields: Partial<S2DataConfig> = {
        fields: {
          // 多指标数值挂行头，单指标挂列头
          valueInCols: size(dataCfg?.fields?.values) <= 1,
        },
      };
      return customMerge(dataCfg, defaultFields);
    }, [dataCfg]);

    const s2Options = React.useMemo<S2Options>(() => {
      return customMerge(options, strategySheetOptions);
    }, [options, strategySheetOptions]);

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={themeCfg}
        dataCfg={s2DataCfg}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
