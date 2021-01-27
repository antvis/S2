/**
 * Create By Bruce Too
 * On 2019-11-27
 */
import { measureTextWidth } from '../../../index';
import * as _ from '@antv/util';
import { Pivot } from '../../../data-set';
import {
  DEFAULT_PADDING,
  ICON_RADIUS,
  TREE_ROW_DEFAULT_WIDTH,
} from '../../../common/constant';
import { SpreadsheetFacet } from '../../index';
import { Hierarchy } from '../hierarchy';

export enum WidthType {
  Compat = -1, // 紧凑模式
  ValueInRow = -2, // 数值挂在行，可能有衍生指标的场景
}
/**
 * Integrate row header's col with col header's col, let theme to share canvas
 * width before render(default width)
 * @param facet
 * @param pivot
 * @param colsHierarchy
 */
export default function processDefaultColWidthByType(
  facet: SpreadsheetFacet,
  pivot: Pivot,
  colsHierarchy: Hierarchy,
) {
  const { rows, rowCfg, cellCfg } = facet.cfg;
  let colWidth = cellCfg.width;
  const canvasW = facet.getCanvasHW().width;
  // 非决策模式下的列宽均分场景才能走这个逻辑
  if (
    !facet.spreadsheet.isStrategyMode() &&
    facet.spreadsheet.isColAdaptive()
  ) {
    // equal width [celCfg.width, canvasW]
    if (!facet.spreadsheet.isHierarchyTreeType()) {
      // canvasW / (rowHeader's col size + colHeader's col size) = [celCfg.width, canvasW]
      const rowHeaderColSize = rows.length;
      const colHeaderColSize = colsHierarchy.getNotNullLeafs().length;
      const size = Math.max(1, rowHeaderColSize + colHeaderColSize);
      colWidth = Math.max(cellCfg.width, canvasW / size);
    } else {
      const drillDownFieldInLevel = facet.spreadsheet.store.get(
        'drillDownFieldInLevel',
        [],
      );
      const drillFields = drillDownFieldInLevel.map((d) => d.drillField);
      const treeHeaderLabel = rows
        .filter((value) => !_.includes(drillFields, value))
        .map((key: string): string => facet.getDataset().getFieldName(key))
        .join('/');
      const textStyle = _.get(facet, 'spreadsheet.theme.header.bolderText');
      // [100, canvasW / 2]
      let width = Math.min(
        Math.max(100, measureTextWidth(treeHeaderLabel, textStyle)),
        canvasW / 2,
      );
      // add icon size and left-right padding
      width += ICON_RADIUS * 2 + DEFAULT_PADDING * 2;
      // let colHeader's col to divide equally
      // (canvasW - treeRowsWidth) / colHeader's col size = [celCfg.width, canvasW - treeRowsWidth]
      if (rowCfg?.treeRowsWidth) {
        // user drag happened
        width = rowCfg.treeRowsWidth;
      } else {
        _.set(facet, 'cfg.treeRowsWidth', width);
        // facet.cfg.treeRowsWidth = width;
      }
      const size = Math.max(1, colsHierarchy.getNotNullLeafs().length);
      colWidth = Math.max(cellCfg.width, (canvasW - width) / size);
    }
  } else {
    // 其他场景1、决策模式，2、自适应宽度场景，其中决策模式有单独的宽控制逻辑
    // compat
    // the width need handle by filed and field value's text length
    colWidth = WidthType.Compat; // mark -1 represent compat text
    if (rowCfg?.treeRowsWidth) {
      // user drag happened
      // facet.cfg.treeRowsWidth = rowCfg.treeRowsWidth + ICON_RADIUS * 2 + DEFAULT_PADDING * 2;
      _.set(
        facet,
        'cfg.treeRowsWidth',
        rowCfg.treeRowsWidth + ICON_RADIUS * 2 + DEFAULT_PADDING * 2,
      );
    } else {
      facet.cfg.treeRowsWidth += ICON_RADIUS * 2 + DEFAULT_PADDING * 2;
    }
  }
  // reset rowHeader,colHeader cell width
  rowCfg.width = colWidth;
  cellCfg.width = colWidth;
  // 如果数值挂在行头 TODO 整个宽度的流程需要全部被梳理
  // if (!facet.spreadsheet.isValueInCols()) {
  //   cellCfg.width = WidthType.ValueInRow;
  // }

  return colWidth;
}
