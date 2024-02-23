import type { SpreadSheet } from '../../../sheet-type';
import type {
  CopyableHTML,
  CopyablePlain,
  CopyAndExportUnifyConfig,
  SheetCopyConstructorParams,
} from '../../../common/interface/export';
import { type DataItem, NewTab } from '../../../common';
import { CopyMIMEType } from '../../../common/interface/export';
import { unifyConfig } from './common';

export abstract class BaseDataCellCopy {
  protected spreadsheet: SpreadSheet;

  protected config: CopyAndExportUnifyConfig;

  constructor(params: SheetCopyConstructorParams) {
    const { spreadsheet, isExport = false, config } = params;

    this.spreadsheet = spreadsheet;
    this.config = unifyConfig({ config, spreadsheet, isExport });
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
    separator = NewTab,
  ): [CopyablePlain, CopyableHTML] {
    return [
      this.matrixPlainTextTransformer(dataMatrix, separator),
      this.matrixHtmlTransformer(dataMatrix),
    ];
  }
}
