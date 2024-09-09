import { MoreOutlined } from '@ant-design/icons';
import {
  CSV_SEPARATOR,
  S2_PREFIX_CLS,
  TAB_SEPARATOR,
  asyncGetAllData,
  asyncGetAllPlainData,
  copyToClipboard,
  download,
  i18n,
  type CopyAllDataParams,
} from '@antv/s2';
import { Button, Dropdown } from 'antd';
import cx from 'classnames';
import React from 'react';
import type { ExportBaseProps, ExportProps } from './interface';

export const Export: React.FC<ExportProps> = React.memo((props) => {
  const {
    className,
    children,
    async = true,
    copyOriginalText = i18n('复制原始数据'),
    copyFormatText = i18n('复制格式化数据'),
    downloadOriginalText = i18n('下载原始数据'),
    downloadFormatText = i18n('下载格式化数据'),
    sheetInstance,
    fileName = 'sheet',
    dropdown,
    customCopyMethod,
    onCopyError,
    onCopySuccess,
    onDownloadSuccess,
    onDownloadError,
    ...restProps
  } = props;

  const PRE_CLASS = `${S2_PREFIX_CLS}-export`;

  const getData = async (
    split: string,
    isFormat: boolean,
    method: ExportBaseProps['customCopyMethod'],
  ) => {
    const params: CopyAllDataParams = {
      sheetInstance,
      split,
      formatOptions: isFormat,
      async,
    };

    const data = await (customCopyMethod?.(params) || method?.(params));

    return data;
  };

  const getPlainData = async (split: string, isFormat: boolean) => {
    const result = await getData(split, isFormat, asyncGetAllPlainData);

    return result as string;
  };

  const getAllData = async (split: string, isFormat: boolean) => {
    const result = await getData(split, isFormat, asyncGetAllData);

    return result;
  };

  const copyData = async (isFormat: boolean) => {
    const data = await getAllData(TAB_SEPARATOR, isFormat);

    copyToClipboard(data!, async)
      .then(() => {
        onCopySuccess?.(data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('copy failed: ', error);
        onCopyError?.(error);
      });
  };

  const downloadData = async (isFormat: boolean) => {
    // 导出的是 csv 格式, 复制时需要以逗号分割 https://github.com/antvis/S2/issues/2701
    const data = await getPlainData(CSV_SEPARATOR, isFormat);

    try {
      download(data, fileName);
      onDownloadSuccess?.(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('download failed: ', error);
      onDownloadError?.(error);
    }
  };

  return (
    <>
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
        {children || (
          <Button type="text">
            <MoreOutlined />
          </Button>
        )}
      </Dropdown>
    </>
  );
});

Export.displayName = 'Export';
