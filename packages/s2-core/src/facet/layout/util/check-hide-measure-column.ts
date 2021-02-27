import { get } from 'lodash';
import { BaseFacet } from '../../base-facet';

export default function checkHideMeasureColumn(
  facet: BaseFacet,
  needValue = false,
): [boolean, number, number] {
  const { values, colCfg } = facet.cfg;
  const isHide = !!(
    get(values, 'length', 0) === 1 && get(colCfg, 'hideMeasureColumn', false)
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
