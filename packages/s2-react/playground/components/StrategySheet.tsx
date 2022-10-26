import { customMerge, SpreadSheet, type S2DataConfig } from '@antv/s2';
import { Switch } from 'antd';
import React from 'react';
import {
  SheetComponent,
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

  return (
    <SheetComponent
      {...props}
      ref={ref}
      sheetType="strategy"
      dataCfg={strategyDataCfg}
      options={StrategyOptions}
      header={{
        title: '趋势分析表',
        description: '支持子弹图',
        switcherCfg: { open: true },
        exportCfg: { open: true },
        extra: (
          <Switch
            checkedChildren="单列头"
            unCheckedChildren="多列头"
            checked={strategyDataCfg.fields.columns.length === 1}
            onChange={(checked) => {
              setStrategyDataCfg(
                customMerge(StrategySheetDataConfig, {
                  fields: {
                    columns: StrategySheetDataConfig.fields.columns.slice(
                      0,
                      checked ? 1 : 2,
                    ),
                  },
                }),
              );
            }}
          />
        ),
      }}
    />
  );
});
