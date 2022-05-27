import React, { FC, ReactNode } from 'react';
import { PageHeader, PageHeaderProps } from 'antd';
import cx from 'classnames';
import { S2DataConfig, S2Options, SpreadSheet } from '@antv/s2';
import { Export, ExportCfgProps } from '../export';
import { AdvancedSort, AdvancedSortCfgProps } from '../advanced-sort';

import { SwitcherCfgProps, SwitcherHeader } from '../switcher/header';
import './index.less';

export interface HeaderCfgProps extends PageHeaderProps {
  width?: React.CSSProperties['width'];
  description?: ReactNode;
  exportCfg?: ExportCfgProps;
  advancedSortCfg?: AdvancedSortCfgProps;
  switcherCfg?: SwitcherCfgProps;
}

export interface HeaderProps extends HeaderCfgProps {
  dataCfg?: S2DataConfig;
  options?: S2Options;
  sheet: SpreadSheet;
}

export const Header: FC<HeaderProps> = ({
  className,
  title,
  width,
  description,
  exportCfg,
  advancedSortCfg,
  switcherCfg,
  sheet,
  extra,
  dataCfg,
  options,
  ...restProps
}) => {
  const PRE_CLASS = 's2-header';

  const getExtraComponents = () => {
    return (
      <>
        {extra}
        {switcherCfg.open && (
          <SwitcherHeader
            sheet={sheet}
            dataCfg={dataCfg}
            options={options}
            {...switcherCfg}
          />
        )}
        {advancedSortCfg.open && (
          <AdvancedSort sheet={sheet} {...advancedSortCfg} />
        )}
        {exportCfg.open && (
          <Export key={'export'} sheet={sheet} {...exportCfg} />
        )}
      </>
    );
  };

  return (
    <PageHeader
      className={cx(PRE_CLASS, className)}
      style={{ width }}
      ghost={false}
      title={title}
      extra={getExtraComponents()}
      {...restProps}
    >
      {description}
    </PageHeader>
  );
};

Header.defaultProps = {
  exportCfg: { open: false },
  advancedSortCfg: { open: false },
  switcherCfg: { open: false },
};
