import { SpreadSheet, type CopyAllDataParams, type Copyable } from '@antv/s2';
import { type DropDownProps } from 'antd';
import React from 'react';

export interface ExportBaseProps {
  className?: string;
  copyOriginalText?: string;
  copyFormatText?: string;
  downloadOriginalText?: string;
  downloadFormatText?: string;
  fileName?: string;
  async?: boolean;
  // ref: https://ant.design/components/dropdown-cn/#API
  dropdown?: DropDownProps;
  customCopyMethod?: (
    params: CopyAllDataParams,
  ) => Promise<string> | string | Promise<Copyable> | Copyable;
  children?: React.ReactNode;
  onCopySuccess?: (data: Copyable | string | undefined) => void;
  onCopyError?: (error: unknown) => void;
  onDownloadSuccess?: (data: string) => void;
  onDownloadError?: (error: unknown) => void;
}

export interface ExportProps extends ExportBaseProps {
  sheetInstance: SpreadSheet;
}
