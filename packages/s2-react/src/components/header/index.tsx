import React, { ReactNode } from 'react';
import { PageHeader } from 'antd';
import cx from 'classnames';
import { SpreadSheet } from '@antv/s2';
import { Export, ExportCfgProps } from '../export';
import { AdvancedSort, AdvancedSortCfgProps } from '../advanced-sort';

import './index.less';

export interface HeaderCfgProps {
  width?: number;
  className?: string;
  title?: React.ReactNode;
  description?: string;
  exportCfg?: ExportCfgProps;
  advancedSortCfg?: AdvancedSortCfgProps;
  extra?: ReactNode[];
}

export interface HeaderProps extends HeaderCfgProps {
  sheet: SpreadSheet;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  title,
  width,
  description,
  exportCfg,
  advancedSortCfg,
  sheet,
  extra = [],
  ...restProps
}) => {
  const PRE_CLASS = 's2-header';

  let extraOperationComponents = extra;
  if (advancedSortCfg.open) {
    const advancedSortNode = (
      <AdvancedSort key={'advancedSort'} sheet={sheet} {...advancedSortCfg} />
    );
    extraOperationComponents = extra.concat([advancedSortNode]);
  }
  if (exportCfg.open) {
    const exportNode = <Export key={'export'} sheet={sheet} {...exportCfg} />;
    extraOperationComponents.push(exportNode);
  }

  return (
    <PageHeader
      className={cx(PRE_CLASS, className)}
      style={{ width: `${width}px` }}
      ghost={false}
      title={title}
      extra={extraOperationComponents}
      {...restProps}
    >
      {description}
    </PageHeader>
  );
};

Header.defaultProps = {
  exportCfg: { open: false },
  advancedSortCfg: { open: false },
};
