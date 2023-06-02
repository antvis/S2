import {
  copyData as getSheetData,
  copyToClipboard,
  download,
  S2_PREFIX_CLS,
  SpreadSheet,
  i18n,
  NewTab,
} from '@antv/s2';
import { Dropdown, Menu, message, type DropDownProps } from 'antd';
import cx from 'classnames';
import React from 'react';
import { DotIcon } from '../icons';

export interface ExportCfgProps {
  open: boolean;
  className?: string;
  icon?: React.ReactNode;
  copyOriginalText?: string;
  copyFormatText?: string;
  downloadOriginalText?: string;
  downloadFormatText?: string;
  successText?: string;
  errorText?: string;
  fileName?: string;
  syncCopy?: boolean;
  // ref: https://ant.design/components/dropdown-cn/#API
  dropdown?: DropDownProps;
}

export interface ExportProps extends ExportCfgProps {
  sheet: SpreadSheet;
}

export const Export: React.FC<ExportProps> = React.memo((props) => {
  const {
    className,
    icon,
    syncCopy = false,
    copyOriginalText = i18n('复制原始数据'),
    copyFormatText = i18n('复制格式化数据'),
    downloadOriginalText = i18n('下载原始数据'),
    downloadFormatText = i18n('下载格式化数据'),
    successText = i18n('操作成功'),
    errorText = i18n('操作失败'),
    sheet,
    fileName = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open,
    dropdown,
    ...restProps
  } = props;

  const PRE_CLASS = `${S2_PREFIX_CLS}-export`;

  const copyData = (isFormat: boolean) => {
    const data = getSheetData({
      sheetInstance: sheet,
      split: NewTab,
      formatOptions: isFormat,
    });

    copyToClipboard(data, syncCopy)
      .then(() => {
        message.success(successText);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('copy failed: ', error);
        message.error(errorText);
      });
  };

  const downloadData = (isFormat: boolean) => {
    const data = getSheetData({
      sheetInstance: sheet,
      split: ',',
      formatOptions: isFormat,
    });

    try {
      download(data, fileName);
      message.success(successText);
    } catch (err) {
      message.error(errorText);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="copyOriginal" onClick={() => copyData(false)}>
        {copyOriginalText}
      </Menu.Item>
      <Menu.Item key="copyFormat" onClick={() => copyData(true)}>
        {copyFormatText}
      </Menu.Item>
      <Menu.Item key="downloadOriginal" onClick={() => downloadData(false)}>
        {downloadOriginalText}
      </Menu.Item>
      <Menu.Item key="downloadFormat" onClick={() => downloadData(true)}>
        {downloadFormatText}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      className={cx(PRE_CLASS, className)}
      {...restProps}
      {...dropdown}
    >
      <a
        className="ant-dropdown-link"
        key="export"
        onClick={(e) => e.preventDefault()}
      >
        {icon || <DotIcon />}
      </a>
    </Dropdown>
  );
});

Export.displayName = 'Export';
Export.defaultProps = {
  syncCopy: false,
  fileName: 'sheet',
};
