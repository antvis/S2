import * as _ from '@antv/util';
import { SpreadsheetFacet } from '../../index';
import { BaseFacet } from '../../base-facet';

/**
 * Create By Bruce Too
 * On 2020-03-18
 * Only when values has one dimension
 * and user config hideMeasureColumn === true
 */
export default function checkHideMeasureColumn(
  facet: BaseFacet,
  needValue = false,
): [boolean, number, number] {
  const { values, colCfg, spreadsheet } = facet.cfg;
  const isHide = !!(
    _.get(values, 'length', 0) === 1 &&
    _.get(colCfg, 'hideMeasureColumn', false)
  );
  let nodeY = 0;
  let nodeHeight = 0;
  if (isHide && needValue) {
    const colsHierarchy = facet.layoutResult.colsHierarchy;
    const preLevelNode = colsHierarchy.getNodes(colsHierarchy.maxLevel - 1)[0];
    if (preLevelNode) {
      nodeY = preLevelNode.y;
      nodeHeight = preLevelNode.height;
    }
  }
  return [isHide, nodeY, nodeHeight];
}
