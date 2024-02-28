import { concat, get } from 'lodash';
import {
  CopyMIMEType,
  type CopyAllDataParams,
  type Copyable,
  type CopyableItem,
} from '../../common/interface/export';
import { asyncProcessAllSelected } from './copy/core';

/**
 * 同步复制
 */
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

/**
 * 异步复制
 */
export const copyToClipboardByClipboard = (data: Copyable): Promise<void> =>
  navigator.clipboard
    .write([
      new ClipboardItem(
        concat(data).reduce((prev, copyable: CopyableItem) => {
          const { type, content } = copyable;
          // eslint-disable-next-line no-control-regex
          const contentToCopy = content.replace(/\x00/g, '');

          return {
            ...prev,
            [type]: new Blob([contentToCopy], { type }),
          };
        }, {}),
      ),
    ])
    .catch(() => copyToClipboardByExecCommand(data));

/**
 * @name 复制数据
 * @param data 数据源
 * @param sync 同步复制
 */
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

/**
 * @name 导出数据
 * @param dataString 数据源 (字符串)
 * @param fileName 文件名 (格式为 csv)
 */
export const download = (dataString: string, fileName: string) => {
  try {
    const link = document.createElement('a');

    link.download = `${fileName}.csv`;
    // Avoid errors in Chinese encoding.
    const dataBlob = new Blob([`\ufeff${dataString}`], {
      type: 'text/csv;charset=utf-8',
    });

    link.href = URL.createObjectURL(dataBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

/**
 * 异步获取文本数据
 * @example
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
      formatOptions: true,
    });
 */
export const asyncGetAllPlainData = async (params: CopyAllDataParams) => {
  const result = await asyncProcessAllSelected(params);

  return result[0].content;
};
