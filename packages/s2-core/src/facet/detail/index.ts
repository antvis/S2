import { i18n } from '../../common/i18n';
import { EXTRA_FIELD } from '../../common/constant';
import { CornerHeader, SeriesNumberHeader } from '../header';
import { SpreadsheetFacet } from '../index';
import { SpreadSheetFacetCfg } from '../../common/interface';
import { Layout } from '../layout';
import { DetailLayout } from '../layout/detail-layout';

/**
 * 明细表:交叉表的特殊场景,so继承自 {@link SpreadsheetFacet}
 * 支持自适应宽度
 * 冻结可配置的行/列数目(TODO)
 * 和交叉表一样分四块group渲染:
 * cornerHeader - 对应左上角的区域,在明细表中默认代表rows的维度(其可又rows,cols,values维度随意slice剪裁)
 * rowHeader - 对应「行头」区域,在明细表中默认代表rows维度的值
 * rolHeader - 对应「列头」区域,在明细表中默认代表cols+values维度
 * centerBorder - 对应区域的分割线,在明细中默认只有一个维度和维度值的分割线
 */
export class DetailFacet extends SpreadsheetFacet {
  constructor(cfg: SpreadSheetFacetCfg) {
    super(cfg);
  }

  public getCornerHeader(): CornerHeader {
    if (this.cornerHeader) {
      return this.cornerHeader;
    }
    return CornerHeader.getCornerHeader(
      this.panelBBox,
      this.cornerBBox,
      this.getSeriesNumberWidth(),
      this.cfg,
      this.layoutResult,
      this.spreadsheet,
    );
  }

  protected getLayout(): Layout {
    return new DetailLayout(this);
  }

  protected getSeriesNumberHeader(): SeriesNumberHeader {
    return SeriesNumberHeader.getSeriesNumberHeader(
      this.panelBBox,
      this.getSeriesNumberWidth(),
      this.layoutResult.rowLeafNodes,
      this.spreadsheet,
      this.cornerBBox.width,
    );
  }

  protected getCornerNodes(
    position,
    height,
    rows,
    rowsHierarchy,
    dataSet,
    seriesNumberWidth,
  ) {
    const cornerNodes = [];
    // 获取最后一个级别的 colNode 的 y 和 height
    if (seriesNumberWidth) {
      // 显示行序号
      cornerNodes.push({
        key: EXTRA_FIELD, // 用于标记行序号
        label: i18n('序号'),
        x: position.x,
        y: position.y,
        width: seriesNumberWidth,
        height,
        isPivotMode: false,
      });
    }

    // 获取每一个级别的 rowNode 的 x 和 width，并与 lastColNode 的 y 和 height 组成 cornerNode
    rowsHierarchy.sampleNodesForAllLevels.forEach((rowNode) => {
      const field = rows[rowNode.level];
      cornerNodes.push({
        key: field,
        label: dataSet.getFieldName(field),
        x: rowNode.x + seriesNumberWidth,
        y: position.y,
        width: rowNode.width,
        height,
        field,
        isPivotMode: false,
        spreadsheet: this.spreadsheet,
      });
    });
    return cornerNodes;
  }
}
