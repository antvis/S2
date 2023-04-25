import { concat, get } from 'lodash';
import type { SpreadSheet } from '../../sheet-type';
import { NewTab } from '../../common/constant/copy';
import {
  CopyMIMEType,
  type Copyable,
  type CopyableItem,
  type FormatOptions,
  type CopyableList,
} from './interface';
import { processAllSelected } from './copy/core';
import { getNodeFormatData, assembleMatrix, getMaxRowLen } from './copy/common';
import { getHeaderList } from './method';

export const copyToClipboardByExecCommand = (data: Copyable): Promise<void> =>
  new Promise((resolve, reject) => {
    let content: string;

    if (Array.isArray(data)) {
      content = get(
        data.filter((item) => item.type === CopyMIMEType.PLAIN),
        '[0].content',
        '',
      ) as string;
    } else {
      content = data.content || '';
    }

    const textarea = document.createElement('textarea');

    textarea.value = content;
    document.body.appendChild(textarea);
    // 开启 preventScroll, 防止页面有滚动条时触发滚动
    textarea.focus({ preventScroll: true });
    textarea.select();

    const success = document.execCommand('copy');

    document.body.removeChild(textarea);

    if (success) {
      resolve();
    } else {
      reject();
    }
  });

export const copyToClipboardByClipboard = (data: Copyable): Promise<void> =>
  navigator.clipboard
    .write([
      new ClipboardItem(
        concat(data).reduce((prev, copyable: CopyableItem) => {
          const { type, content } = copyable;

          return {
            ...prev,
            [type]: new Blob([content], { type }),
          };
        }, {}),
      ),
    ])
    .catch(() => copyToClipboardByExecCommand(data));

export const copyToClipboard = (
  data: Copyable | string,
  sync = false,
): Promise<void> => {
  let copyableItem: Copyable;

  if (typeof data === 'string') {
    copyableItem = {
      content: data,
      type: CopyMIMEType.PLAIN,
    };
  } else {
    copyableItem = data;
  }

  if (!navigator.clipboard || !window.ClipboardItem || sync) {
    return copyToClipboardByExecCommand(copyableItem);
  }

  return copyToClipboardByClipboard(copyableItem);
};

export const download = (str: string, fileName: string) => {
  try {
    const link = document.createElement('a');

    link.download = `${fileName}.csv`;
    // Avoid errors in Chinese encoding.
    const dataBlob = new Blob([`\ufeff${str}`], {
      type: 'text/csv;charset=utf-8',
    });

    link.href = URL.createObjectURL(dataBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

/**
 * Copy data
 * @param sheetInstance
 * @param split
 * @param formatOptions 是否格式化数据
 */
// TODO: 改名
export const copyData = (
  sheetInstance: SpreadSheet,
  split = NewTab,
  formatOptions?: FormatOptions,
) => processAllSelected(sheetInstance, split, formatOptions)[0].content;

export { CopyableList, FormatOptions };
export { assembleMatrix, getMaxRowLen, getNodeFormatData };
export { getHeaderList };
