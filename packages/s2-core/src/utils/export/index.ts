import { assembleMatrix, getMaxRowLen, getNodeFormatData } from './copy/common';
import type { CopyableList, FormatOptions } from './interface';
import { getHeaderList } from './method';

export type { CopyableList, FormatOptions };
export { assembleMatrix, getMaxRowLen, getNodeFormatData };
export { getHeaderList };
export {
  copyToClipboard,
  copyToClipboardByClipboard,
  copyToClipboardByExecCommand,
  asyncGetAllPlainData,
} from './utils';
