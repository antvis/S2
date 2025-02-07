import { map } from 'lodash';
import {
  AsyncRenderThreshold,
  TAB_SEPARATOR,
  type DataItem,
  type Formatter,
  type SimpleData,
} from '../../../common';
import type {
  CopyAndExportUnifyConfig,
  CopyableHTML,
  CopyablePlain,
  SheetCopyConstructorParams,
} from '../../../common/interface/export';
import { CopyMIMEType } from '../../../common/interface/export';
import { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import {
  escapeField,
  getHeaderList,
  getHeaderMeasureFieldNames,
} from '../method';
import { unifyConfig } from './common';

export abstract class BaseDataCellCopy {
  protected spreadsheet: SpreadSheet;

  protected config: CopyAndExportUnifyConfig;

  protected idleCallbackCount: number;

  protected initIdleCallbackCount(rowLength: number) {
    this.idleCallbackCount =
      rowLength >= AsyncRenderThreshold ? AsyncRenderThreshold : rowLength;
  }

  constructor(params: SheetCopyConstructorParams) {
    const { spreadsheet, isExport = false, config } = params;

    this.spreadsheet = spreadsheet;
    this.config = unifyConfig({ config, spreadsheet, isExport });
  }

  protected getHeaderNodeMatrix(node: Node) {
    const { formatHeader } = this.config;

    return getHeaderMeasureFieldNames(
      getHeaderList(node.id),
      node.spreadsheet,
      formatHeader,
    );
  }

  private matrixPlainTextTransformer(
    dataMatrix: SimpleData[][],
    separator: string,
  ): CopyablePlain {
    const escapeDataMatrix: SimpleData[][] = map(dataMatrix, (row) =>
      map(row, escapeField),
    );

    return this.config.transformers[CopyMIMEType.PLAIN](
      escapeDataMatrix,
      separator,
    ) as CopyablePlain;
  }

  private matrixHtmlTransformer = (dataMatrix: DataItem[][]): CopyableHTML => {
    return this.config.transformers[CopyMIMEType.HTML](
      dataMatrix,
    ) as CopyableHTML;
  };

  protected matrixTransformer(
    dataMatrix: SimpleData[][],
    separator = TAB_SEPARATOR,
  ): [CopyablePlain, CopyableHTML] {
    return [
      this.matrixPlainTextTransformer(dataMatrix, separator),
      this.matrixHtmlTransformer(dataMatrix),
    ];
  }

  protected getFormatter(options: {
    field: string;
    rowIndex: number;
    colIndex: number;
  }): Formatter {
    const { field, rowIndex, colIndex } = options;

    if (this.config.formatData) {
      const viewMeta = this.spreadsheet.facet.getCellMeta(rowIndex, colIndex);

      return (value) => {
        const formatter = this.spreadsheet.dataSet.getFieldFormatter(field!);

        return formatter?.(value, viewMeta?.data, viewMeta);
      };
    }

    return ((value) => value) as Formatter;
  }

  /**
   * Safari 等不支持 requestIdleCallback 的浏览器, 降级为同步
   */
  protected isEnableASync() {
    return this.config.async && !!window.requestIdleCallback;
  }
}
