import {
  AsyncRenderThreshold,
  TAB_SEPARATOR,
  type DataItem,
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
import { getHeaderList, getHeaderMeasureFieldNames } from '../method';
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
    dataMatrix: string[][],
    separator: string,
  ): CopyablePlain {
    return this.config.transformers[CopyMIMEType.PLAIN](
      dataMatrix,
      separator,
    ) as CopyablePlain;
  }

  private matrixHtmlTransformer = (dataMatrix: DataItem[][]): CopyableHTML => {
    return this.config.transformers[CopyMIMEType.HTML](
      dataMatrix,
    ) as CopyableHTML;
  };

  protected matrixTransformer(
    dataMatrix: string[][],
    separator = TAB_SEPARATOR,
  ): [CopyablePlain, CopyableHTML] {
    return [
      this.matrixPlainTextTransformer(dataMatrix, separator),
      this.matrixHtmlTransformer(dataMatrix),
    ];
  }
}
