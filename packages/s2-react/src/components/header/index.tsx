import React from 'react';
import { App, Space } from 'antd';
import cx from 'classnames';
import { S2_PREFIX_CLS, type S2DataConfig, type SpreadSheet } from '@antv/s2';
import { Export, type ExportBaseProps } from '../export';
import { AdvancedSort, type AdvancedSortBaseProps } from '../advanced-sort';
import { type SwitcherProps, SwitcherHeader } from '../switcher/header';
import type { SheetComponentOptions } from '../sheets/interface';
import './index.less';

export interface HeaderBaseProps {
  style?: React.CSSProperties;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  export?: ExportBaseProps;
  advancedSort?: AdvancedSortBaseProps;
  switcher?: SwitcherProps;
  extra?: React.ReactNode;
}

export interface HeaderProps extends HeaderBaseProps {
  dataCfg?: S2DataConfig;
  options?: SheetComponentOptions;
  sheet: SpreadSheet;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    className,
    style,
    title,
    description,
    export: exportProps,
    advancedSort,
    switcher,
    sheet,
    extra,
    dataCfg,
    options,
    ...restProps
  }) => {
    const PRE_CLASS = `${S2_PREFIX_CLS}-header`;

    const renderExtra = () => (
      <Space align="center">
        {extra}
        {switcher?.open && (
          <SwitcherHeader
            sheet={sheet}
            dataCfg={dataCfg!}
            options={options!}
            {...switcher}
          />
        )}
        {advancedSort?.open && <AdvancedSort sheet={sheet} {...advancedSort} />}
        {exportProps?.open && <Export sheet={sheet} {...exportProps} />}
      </Space>
    );

    return (
      <App>
        <div className={cx(PRE_CLASS, className)} style={style} {...restProps}>
          <div className={`${PRE_CLASS}-heading`}>
            <div className={`${PRE_CLASS}-heading-left`}>
              <div className={`${PRE_CLASS}-heading-title`}>{title}</div>
            </div>
            <div className={`${PRE_CLASS}-heading-extra`}>{renderExtra()}</div>
          </div>
          <div className={`${PRE_CLASS}-content`}>{description}</div>
        </div>
      </App>
    );
  },
);

Header.displayName = 'Header';
Header.defaultProps = {
  export: { open: false },
  advancedSort: { open: false },
  switcher: { open: false },
};
