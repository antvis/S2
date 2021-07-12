// TODO re-design Table mode. delete this file
import { each, get } from 'lodash';
import {
  DEFAULT_COLUMN,
  DEFAULT_ROW,
  DEFAULT_VALUE,
} from '../../../utils/get-irregular-data';
import { EXTRA_FIELD, ID_SEPARATOR } from '../../../common/constant';
import { DetailDataSet } from '../../../data-set';
import { BaseFacet } from '../../index';
import { SpreadSheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import processColLeafNodeWH from './process-col-leaf-node-wh';

function processCols(
  parent: Node,
  fields: string[],
  hierarchy: Hierarchy,
  dataSet,
) {
  each(fields, (field: string) => {
    // ignore col = EXTRA_FIELD
    if (
      field !== EXTRA_FIELD &&
      field !== DEFAULT_COLUMN &&
      field !== DEFAULT_ROW &&
      field !== DEFAULT_VALUE
    ) {
      const node = new Node({
        id: `${parent.id}${ID_SEPARATOR}${field}`,
        key: field,
        field,
        value: dataSet.getFieldName(field),
        level: 1,
        parent,
        isTotals: false,
        isCollapsed: false,
        isSubTotals: false,
        isGrandTotals: false,
      });
      node.isLeaf = true; // 只有一层，所以都是叶子节点
      hierarchy.pushNode(node);
    }
  });
}

export default function processColsList(
  facet: BaseFacet,
  cfg: SpreadSheetFacetCfg,
  cols: string[],
  dataSet: DetailDataSet,
  rowsHierarchy: Hierarchy,
) {
  const { cellCfg, colCfg } = cfg;
  const rootNode = Node.rootNode();
  const colsHierarchy = new Hierarchy();
  processCols(rootNode, cols, colsHierarchy, dataSet);

  const colLeafNodes = colsHierarchy.getLeaves();
  processColLeafNodeWH(colLeafNodes, rowsHierarchy, cfg, facet, false);

  // width / height for header area
  // 无论怎么变 都是以$$column$$来做判断，别问我为什么，我也是看规律发现的
  colsHierarchy.height = get(
    colCfg,
    'heightByField.$$column$$',
    cellCfg.height,
  );
  each(rootNode.children, (node) => {
    if (node) {
      colsHierarchy.width += node.width;
      // 每个node高度以最高的为标准~
      node.height = colsHierarchy.height;
    }
  });

  return {
    colLeafNodes,
    colsHierarchy,
  };
}
