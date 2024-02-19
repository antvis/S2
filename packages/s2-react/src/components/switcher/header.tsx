import React from 'react';
import type { S2DataConfig, SpreadSheet } from '@antv/s2';
import { useUpdateEffect } from 'ahooks';
import type { SheetComponentOptions } from '../sheets/interface';
import {
  generateSheetConfig,
  generateSwitcherFields,
  generateSwitcherFieldsCfgFromResult,
  getSheetType,
} from './headerUtil';
import type { SwitcherResult } from './interface';
import { Switcher, type SwitcherProps as DefaultSwitcherProps } from './';
import './index.less';

type SwitcherBasicCfg = Pick<
  DefaultSwitcherProps,
  | 'title'
  | 'resetText'
  | 'innerContentClassName'
  | 'contentTitleText'
  | 'popover'
  | 'disabled'
  | 'allowExchangeHeader'
>;

export interface SwitcherProps extends SwitcherBasicCfg {
  open?: boolean;
}

export interface SwitcherHeaderProps extends SwitcherBasicCfg {
  sheet: SpreadSheet;
  dataCfg: S2DataConfig;
  options: SheetComponentOptions;
}

export const SwitcherHeader: React.FC<SwitcherHeaderProps> = ({
  sheet,
  dataCfg,
  options,
  ...props
}) => {
  const [fields, setFields] = React.useState(() =>
    generateSwitcherFields(
      sheet,
      dataCfg,
      options?.interaction?.hiddenColumnFields,
    ),
  );

  useUpdateEffect(() => {
    setFields(
      generateSwitcherFields(
        sheet,
        dataCfg,
        options?.interaction?.hiddenColumnFields,
      ),
    );
  }, [sheet, dataCfg, options?.interaction?.hiddenColumnFields]);

  const onSubmit = (result: SwitcherResult) => {
    const { fields: currentFields, hiddenColumnFields } = generateSheetConfig(
      sheet,
      result,
    );

    sheet.setDataCfg({
      fields: { ...sheet.dataCfg.fields, ...currentFields },
    } as S2DataConfig);

    if (hiddenColumnFields) {
      sheet.setOptions({ interaction: { hiddenColumnFields } });
    }

    sheet.render();

    setFields(
      generateSwitcherFieldsCfgFromResult(
        sheet,
        result,
        sheet.dataCfg?.meta,
        hiddenColumnFields,
      ),
    );
  };

  return (
    <Switcher
      sheetType={getSheetType(sheet)}
      onSubmit={onSubmit}
      {...props}
      {...fields}
    />
  );
};
