import React from 'react';
import { customMerge, SpreadSheet } from '@antv/s2';
import { isEmpty, size } from 'lodash';
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

    const strategySheetOptions = React.useMemo(() => {
      if (isEmpty(dataCfg)) {
        return {};
      }
      return {
        dataCell: (viewMeta) =>
          new CustomDataCell(viewMeta, viewMeta.spreadsheet),
        colCell: (...args) => new CustomColCell(...args),
        showDefaultHeaderActionIcon: false,
        hierarchyType: isEmpty(dataCfg.fields.rows) ? 'customTree' : 'tree',

        style: {
          colCfg: {
            height: 38,
            hideMeasureColumn: !(size(dataCfg.fields.values) > 1),
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
    }, [dataCfg]);

    const s2DataCfg = React.useMemo(() => {
      const defaultFields = {
        fields: {
          valueInCols: !(size(dataCfg.fields.values) > 1),
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
