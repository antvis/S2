import {
  customMerge,
  isUpDataValue,
  SpreadSheet,
  type S2DataConfig,
} from '@antv/s2';
import { Switch } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import {
  StrategyOptions,
  StrategySheetDataConfig,
} from '../../__tests__/data/strategy-data';

export const StrategySheet: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  const [strategyDataCfg, setStrategyDataCfg] = React.useState<S2DataConfig>(
    StrategySheetDataConfig,
  );
  const [showConditions, setShowConditions] = React.useState(false);

  const conditions: SheetComponentOptions['conditions'] = {
    text: [
      {
        field: 'date',
        mapping: (value) => {
          if (value === '2022-09') {
            return {
              fill: 'red',
              fontSize: 26,
              textAlign: 'right',
            };
          }
        },
      },
      {
        field: 'number',
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          const isNilValue = isNil(value) || value === '';

          if (colIndex === 0 || isNilValue) {
            return {
              fill: '#000',
              fontSize: 16,
              fontWeight: 800,
              opacity: 0.7,
            };
          }

          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
            fontSize: 30,
          };
        },
      },
    ],
    icon: [
      {
        field: 'number',
        position: 'left',
        mapping(value, cellInfo) {
          const { colIndex } = cellInfo;

          if (colIndex === 0) {
            return null;
          }

          return isUpDataValue(value)
            ? {
                // icon 用于指定图标条件格式所使用的 icon 类型
                icon: 'CellUp',
                fill: '#FF4D4F',
                size: 16,
              }
            : {
                icon: 'CellDown',
                fill: '#29A294',
                size: 12,
              };
        },
      },
    ],
  };

  return (
    <SheetComponent
      {...props}
      ref={ref}
      sheetType="strategy"
      dataCfg={strategyDataCfg}
      options={{
        ...StrategyOptions,
        conditions: showConditions ? conditions : StrategyOptions.conditions,
      }}
      header={{
        title: '趋势分析表',
        description: '支持子弹图',
        switcherCfg: { open: true },
        exportCfg: { open: true },
        extra: (
          <>
            <Switch
              checkedChildren="开启字段标记"
              unCheckedChildren="关闭字段标记"
              checked={showConditions}
              onChange={(checked) => {
                setShowConditions(checked);
              }}
            />
            <Switch
              checkedChildren="单列头"
              unCheckedChildren="多列头"
              checked={strategyDataCfg.fields.columns?.length === 1}
              onChange={(checked) => {
                setStrategyDataCfg(
                  customMerge(StrategySheetDataConfig, {
                    fields: {
                      columns: StrategySheetDataConfig.fields.columns?.slice(
                        0,
                        checked ? 1 : 2,
                      ),
                    },
                  }),
                );
              }}
            />
          </>
        ),
      }}
    />
  );
});
