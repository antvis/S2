import React, { FC, ReactNode } from 'react';
import { PageHeader } from 'antd';
import cx from 'classnames';
import { S2DataConfig, S2Options, SpreadSheet } from '@antv/s2';
import { Export, ExportCfgProps } from '../export';
import { AdvancedSort, AdvancedSortCfgProps } from '../advanced-sort';

import { SwitcherCfgProps, SwitcherHeader } from '../switcher/header';
import './index.less';

export interface HeaderCfgProps {
  width?: number;
  className?: string;
  title?: ReactNode;
  description?: string;
  exportCfg?: ExportCfgProps;
  advancedSortCfg?: AdvancedSortCfgProps;
  switcherCfg?: SwitcherCfgProps;
  extra?: ReactNode;
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
    const extraOperationComponents = [extra];
    if (switcherCfg.open) {
      const switcherNode = (
        <SwitcherHeader
          key={'switcher'}
          sheet={sheet}
          dataCfg={dataCfg}
          options={options}
          {...switcherCfg}
        />
      );
      extraOperationComponents.push(switcherNode);
    }

    if (advancedSortCfg.open) {
      const advancedSortNode = (
        <AdvancedSort key={'advancedSort'} sheet={sheet} {...advancedSortCfg} />
      );
      extraOperationComponents.push(advancedSortNode);
    }
    if (exportCfg.open) {
      const exportNode = <Export key={'export'} sheet={sheet} {...exportCfg} />;
      extraOperationComponents.push(exportNode);
    }
    return extraOperationComponents;
  };

  return (
    <PageHeader
      className={cx(PRE_CLASS, className)}
      style={{ width: `${width}px` }}
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
