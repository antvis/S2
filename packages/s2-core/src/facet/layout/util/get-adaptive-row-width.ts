import { measureTextWidth } from '../../../utils/text';
import _ from 'lodash';
import { DEFAULT_PADDING, ICON_RADIUS } from '../../../common/constant';
import { SpreadsheetFacet } from '../../index';
import {
  CellCfg,
  RowCfg,
  SpreadsheetFacetCfg,
} from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import getRowWidth from './get-row-width';
import { WidthType } from './process-default-col-width-by-type';

/**
 * Get rowHeader col node's width
 * There are tow types
 * 1、adaptive
 * let rowHeader's col nodes share canvas height with colHeader's col nodes width
 * 2、compat
 * each col(include in rowHeader and colHeader) width depend on the text size in related values
 * @param rowsHierarchy
 * @param node
 * @param rowCfg
 * @param cellCfg
 * @param facet
 * @param cfg
 * @param isSpreadsheetType
 */
export default function getAdaptiveRowWidth(
  rowsHierarchy: Hierarchy,
  node: Node,
  rowCfg: RowCfg,
  cellCfg: CellCfg,
  facet: SpreadsheetFacet,
  cfg: SpreadsheetFacetCfg,
  isSpreadsheetType = true,
) {
  if (rowCfg.width === WidthType.Compat) {
    // compat
    const field = rowsHierarchy.rows[node.level];
    const store = facet.cfg.spreadsheet.store;
    const fieldLevelMaxLabel = store.get('fieldLevelMaxLabel') || {};
    const { isLeaf, isTotals } = node;
    const textStyle =
      isLeaf && !isTotals
        ? _.get(cfg, 'spreadsheet.theme.header.text')
        : _.get(cfg, 'spreadsheet.theme.header.bolderText');
    let maxLabelRealWidth = 0;
    if (fieldLevelMaxLabel[field]) {
      // 记录过当前维度的最大label, 计算它
      maxLabelRealWidth = fieldLevelMaxLabel[field];
    } else {
      // 没有记录
      const fieldLabel = cfg.dataSet.getFieldName(field) || '';
      let label;
      if (isSpreadsheetType) {
        // 交叉表 情况
        // 检查node在哪个层级，通过层级的所有cols值来获取该层级最大的宽度
        const { maxLabel } = rowsHierarchy.getMinMaxLabelInLevel(node.level);
        label = maxLabel + '';
      } else {
        // 明细表 情况
        label =
          _.maxBy(
            cfg.dataSet.pivot
              .getDimValues(field)
              .filter((value) => !_.isEmpty(value))
              .slice(0, 20),
            (value) => value.toString().length,
          ) + '';
      }
      const finalLabel = fieldLabel.length > label.length ? fieldLabel : label;
      maxLabelRealWidth = Math.ceil(measureTextWidth(finalLabel, textStyle));
      store.set('fieldLevelMaxLabel', {
        ...fieldLevelMaxLabel,
        [field]: maxLabelRealWidth,
      });
    }
    /*
    1、in spreadsheet
    width = DEFAULT_PADDING + realWidth + DEFAULT_PADDING
    2、in list sheet
    width = DEFAULT_PADDING + realWidth + DEFAULT_PADDING + ICON_RADIUS * 2 + DEFAULT_PADDING
     */
    let newWidth;
    if (isSpreadsheetType) {
      newWidth = maxLabelRealWidth + DEFAULT_PADDING * 3;
    } else {
      newWidth = maxLabelRealWidth + DEFAULT_PADDING * 3 + ICON_RADIUS * 2;
    }
    const newRowCfg = {
      width: newWidth,
      widthByField: rowCfg.widthByField,
    } as RowCfg;
    return getRowWidth(node, newRowCfg, cellCfg);
  }
  // adaptive
  // do nothing, use colWidth by divide equally
  return getRowWidth(node, rowCfg, cellCfg);
}
