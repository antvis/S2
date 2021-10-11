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
  exportCfg = { open: false },
  advancedSortCfg = { open: false },
  sheet,
  extra = [],
  ...restProps
}) => {
  const PRECLASS = 'spreadsheet-header';
  const { open } = exportCfg;
  let extraDoms = [];
  if (sheet && advancedSortCfg.open) {
    const exportNode = <AdvancedSort sheet={sheet} {...advancedSortCfg} />;
    extraDoms = extra.concat([exportNode]);
  }
  if (sheet && open) {
    const exportNode = <Export sheet={sheet} {...exportCfg} />;
    extraDoms = extraDoms.concat([exportNode]);
  }

  return (
    <PageHeader
      className={cx(PRECLASS, className)}
      ghost={false}
      title={title}
      extra={extraDoms}
      {...restProps}
    >
      {description}
    </PageHeader>
  );
};
