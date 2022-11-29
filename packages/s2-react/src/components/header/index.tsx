import React from 'react';
import { Space } from 'antd';
import cx from 'classnames';
import type { S2DataConfig, SpreadSheet } from '@antv/s2';
import { Export, type ExportCfgProps } from '../export';
import { AdvancedSort, type AdvancedSortCfgProps } from '../advanced-sort';
import { type SwitcherCfgProps, SwitcherHeader } from '../switcher/header';
import './index.less';
import type { SheetComponentOptions } from '../sheets/interface';

export interface HeaderCfgProps {
  style?: React.CSSProperties;
  className?: string;
  /**
   * @deprecated 已废弃, 请使用 style 代替
   */
  width?: React.CSSProperties['width'];
  title?: React.ReactNode;
  description?: React.ReactNode;
  exportCfg?: ExportCfgProps;
  advancedSortCfg?: AdvancedSortCfgProps;
  switcherCfg?: SwitcherCfgProps;
  extra?: React.ReactNode;
}

export interface HeaderProps extends HeaderCfgProps {
  dataCfg?: S2DataConfig;
  options?: SheetComponentOptions;
  sheet: SpreadSheet;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    className,
    style,
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

    const renderExtra = () => {
      return (
        <Space align="center">
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
          {exportCfg.open && <Export sheet={sheet} {...exportCfg} />}
        </Space>
      );
    };

    return (
      <>
        <div
          className={cx(PRE_CLASS, className)}
          style={{ ...style, width }}
          {...restProps}
        >
          <div className={`${PRE_CLASS}-heading`}>
            <div className={`${PRE_CLASS}-heading-left`}>
              <div className={`${PRE_CLASS}-heading-title`}>{title}</div>
            </div>
            <div className={`${PRE_CLASS}-heading-extra`}>{renderExtra()}</div>
          </div>
          <div className={`${PRE_CLASS}-content`}>{description}</div>
        </div>
      </>
    );
  },
);

Header.displayName = 'Header';
Header.defaultProps = {
  exportCfg: { open: false },
  advancedSortCfg: { open: false },
  switcherCfg: { open: false },
};
