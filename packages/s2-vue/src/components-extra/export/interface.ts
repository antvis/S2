import type { CopyAllDataParams, Copyable, SpreadSheet } from '@antv/s2';
import type { DropdownProps } from 'ant-design-vue';

export interface ExportBaseProps {
  className?: string;
  copyOriginalText?: string;
  copyFormatText?: string;
  downloadOriginalText?: string;
  downloadFormatText?: string;
  fileName?: string;
  async?: boolean;
  dropdown?: DropdownProps;
  customCopyMethod?: (
    params: CopyAllDataParams,
  ) => Promise<string> | string | Promise<Copyable> | Copyable;
  onCopySuccess?: (data: Copyable | string | undefined) => void;
  onCopyError?: (error: unknown) => void;
  onDownloadSuccess?: (data: string) => void;
  onDownloadError?: (error: unknown) => void;
}

export interface ExportProps extends ExportBaseProps {
  sheetInstance: SpreadSheet;
}
