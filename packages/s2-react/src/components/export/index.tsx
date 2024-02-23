import {
  NewTab,
  S2_PREFIX_CLS,
  SpreadSheet,
  asyncGetAllPlainData,
  copyToClipboard,
  download,
  i18n,
  type CopyAllDataParams,
} from '@antv/s2';
import { Button, Dropdown, message, type DropDownProps } from 'antd';
import cx from 'classnames';
import React from 'react';
import { DotIcon } from '../icons';

export interface ExportBaseProps {
  open?: boolean;
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
  customCopyMethod?: (params: CopyAllDataParams) => Promise<string> | string;
}

export interface ExportProps extends ExportBaseProps {
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
    customCopyMethod,
    ...restProps
  } = props;

  const PRE_CLASS = `${S2_PREFIX_CLS}-export`;

  const [messageApi, contextHolder] = message.useMessage();

  const copyData = async (isFormat: boolean) => {
    const params: CopyAllDataParams = {
      sheetInstance: sheet,
      split: NewTab,
      formatOptions: isFormat,
    };

    const data = await (customCopyMethod?.(params) ||
      asyncGetAllPlainData(params));

    copyToClipboard(data, syncCopy)
      .then(() => {
        messageApi.success(successText);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('copy failed: ', error);
        messageApi.error(errorText);
      });
  };

  const downloadData = async (isFormat: boolean) => {
    const data = await asyncGetAllPlainData({
      sheetInstance: sheet,
      split: NewTab,
      formatOptions: isFormat,
    });

    try {
      download(data, fileName);
      messageApi.success(successText);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('download failed: ', error);
      messageApi.error(errorText);
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: 'copyOriginal',
              label: copyOriginalText,
              onClick: () => {
                copyData(false);
              },
            },
            {
              key: 'copyFormat',
              label: copyFormatText,
              onClick: () => {
                copyData(true);
              },
            },
            {
              key: 'downloadOriginal',
              label: downloadOriginalText,
              onClick: () => {
                downloadData(false);
              },
            },
            {
              key: 'downloadFormat',
              label: downloadFormatText,
              onClick: () => {
                downloadData(true);
              },
            },
          ],
        }}
        trigger={['click']}
        className={cx(PRE_CLASS, className)}
        {...restProps}
        {...dropdown}
      >
        <Button type="text">{icon || <DotIcon />}</Button>
      </Dropdown>
    </>
  );
});

Export.displayName = 'Export';
Export.defaultProps = {
  syncCopy: false,
  fileName: 'sheet',
};
