import React from 'react';
import {
  customMerge,
  SpreadSheet,
  ViewMeta,
  ColHeaderConfig,
  Node,
  MultiData,
} from '@antv/s2';
import { forEach, forIn, get, isEmpty, isObject, max, size } from 'lodash';
import { BaseSheet } from '../base-sheet';
import { StrategyTheme } from './strategy-theme';
import { RowTooltip } from './custom-tooltip/custom-row-tooltip';
import { ColTooltip } from './custom-tooltip/custom-col-tooltip';
import { DataTooltip } from './custom-tooltip/custom-data-tooltip';
import { CustomColCell } from './custom-col-cell';
import { CustomDataCell } from './custom-data-cell';
import { SheetComponentsProps } from '@/components/sheets/interface';

/* *
 * 趋势分析表特性：
 * 1. 维度为空时默人为自定义目录树结构
 * 2. 单指标时数值置于列头，且隐藏指标列头
 * 3. 多指标时数值置于行头，不隐藏指标列头
 */
export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, themeCfg, dataCfg, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();

    const s2ThemeCfg = React.useMemo(() => {
      return customMerge({}, themeCfg, { theme: StrategyTheme });
    }, [themeCfg]);

    const getCellWidth = () => {
      const { data } = dataCfg;
      const lengths = [];
      // 采样前50，根据指标个数获取单元格列宽
      // TODO 动态根据内容来计算列宽
      const demoData = data.slice(0, 50) || [];
      forEach(demoData, (value) => {
        forIn(value, (v: MultiData) => {
          if (isObject(v) && v?.values) {
            lengths.push(size(v?.values[0]));
          }
        });
      });
      const maxLength = max(lengths) || 1;
      const cellWidth = get(options, 'style.cellCfg.width', 0);
      return maxLength * cellWidth;
    };

    const strategySheetOptions = React.useMemo(() => {
      if (isEmpty(dataCfg)) {
        return {};
      }
      let hideMeasureColumn = false;
      let hierarchyType = 'tree';

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
      return {
        dataCell: (viewMeta: ViewMeta) =>
          new CustomDataCell(viewMeta, viewMeta.spreadsheet),
        colCell: (
          node: Node,
          spreadsheet: SpreadSheet,
          headerConfig: ColHeaderConfig,
        ) => new CustomColCell(node, spreadsheet, headerConfig),
        showDefaultHeaderActionIcon: false,
        hierarchyType,

        style: {
          colCfg: {
            height: 38,
            hideMeasureColumn,
          },
          cellCfg: {
            width: getCellWidth(),
          },
        },
        interaction: {
          autoResetSheetStyle: true,
          // 趋势分析表禁用 刷选, 多选, 区间多选
          brushSelection: false,
          multiSelection: false,
          rangeSelection: false,
        },
        tooltip: {
          operation: {
            hiddenColumns: true,
          },
          row: {
            content: (cell, defaultTooltipShowOptions) => (
              <RowTooltip
                cell={cell}
                defaultTooltipShowOptions={defaultTooltipShowOptions}
              />
            ),
          },
          col: {
            content: (cell, defaultTooltipShowOptions) => (
              <ColTooltip
                cell={cell}
                defaultTooltipShowOptions={defaultTooltipShowOptions}
              />
            ),
          },
          data: {
            content: (cell, defaultTooltipShowOptions) => (
              <DataTooltip
                cell={cell}
                defaultTooltipShowOptions={defaultTooltipShowOptions}
              />
            ),
          },
        },
      };
    }, [dataCfg, options.hierarchyType]);

    const s2DataCfg = React.useMemo(() => {
      const defaultFields = {
        fields: {
          valueInCols: !(size(dataCfg?.fields?.values) > 1), // 多指标数值挂行头，单指标挂列头
        },
      };
      return customMerge({}, dataCfg, defaultFields);
    }, [dataCfg]);

    const s2Options = React.useMemo(() => {
      return customMerge({}, options, strategySheetOptions);
    }, [options, strategySheetOptions]);

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={s2ThemeCfg}
        dataCfg={s2DataCfg}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
