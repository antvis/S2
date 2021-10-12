import React, { ReactNode } from 'react';
import { PageHeader } from 'antd';
import cx from 'classnames';
import { Export, ExportCfgProps } from '../export';
import { AdvancedSort, AdvancedSortCfgProps } from '../advanced-sort';
import { SpreadSheet } from '@/sheet-type';

export interface HeaderCfgProps {
  style?: React.CSSProperties;
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
  description,
  exportCfg,
  advancedSortCfg,
  sheet,
  extra = [],
  ...restProps
}) => {
  const PRECLASS = 'spreadsheet-header';
  let extraOperationComponents = [];
  if (advancedSortCfg.open) {
    const advancedSortNode = (
      <AdvancedSort sheet={sheet} {...advancedSortCfg} />
    );
    extraOperationComponents = extra.concat([advancedSortNode]);
  }
  if (exportCfg.open) {
    const exportNode = <Export sheet={sheet} {...exportCfg} />;
    extraOperationComponents.push(exportNode);
  }

  return (
    <PageHeader
      className={cx(PRECLASS, className)}
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
