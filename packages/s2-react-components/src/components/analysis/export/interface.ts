import { SpreadSheet, type CopyAllDataParams, type Copyable } from '@antv/s2';
import { type DropDownProps } from 'antd';
import React from 'react';

export interface ExportBaseProps {
  open?: boolean;
  className?: string;
  copyOriginalText?: string;
  copyFormatText?: string;
  downloadOriginalText?: string;
  downloadFormatText?: string;
  successText?: string;
  errorText?: string;
  fileName?: string;
  async?: boolean;
  // ref: https://ant.design/components/dropdown-cn/#API
  dropdown?: DropDownProps;
  customCopyMethod?: (
    params: CopyAllDataParams,
  ) => Promise<string> | string | Promise<Copyable> | Copyable;
  children?: React.ReactNode;
}

export interface ExportProps extends ExportBaseProps {
  sheetInstance: SpreadSheet;
}
