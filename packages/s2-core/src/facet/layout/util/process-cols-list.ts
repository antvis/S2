import * as _ from '@antv/util';
import {
  DEFAULT_COLUMN,
  DEFAULT_ROW,
  DEFAULT_VALUE,
} from '../../../utils/get-irregular-data';
import { EXTRA_FIELD } from '../../../common/constant';
import { DetailDataSet } from '../../../data-set';
import { SpreadsheetFacet } from '../../index';
import { SpreadsheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import processColLeafNodeWH from './process-col-leaf-node-wh';
import { ColsResult } from './process-cols';

function processCols(
  parent: Node,
  fields: string[],
  hierarchy: Hierarchy,
  dataSet,
) {
  _.each(fields, (field: string) => {
    // ignore col = EXTRA_FIELD
    if (
      field !== EXTRA_FIELD &&
      field !== DEFAULT_COLUMN &&
      field !== DEFAULT_ROW &&
      field !== DEFAULT_VALUE
    ) {
      const node = new Node({
        id: `${parent.id}-${field}`,
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
  facet: SpreadsheetFacet,
  cfg: SpreadsheetFacetCfg,
  cols: string[],
  dataSet: DetailDataSet,
  rowsHierarchy: Hierarchy,
) {
  const { cellCfg, colCfg } = cfg;
  const rootNode = Node.rootNode();
  const colsHierarchy = new Hierarchy();
  processCols(rootNode, cols, colsHierarchy, dataSet);

  const colLeafNodes = colsHierarchy.getLeafs();
  processColLeafNodeWH(colLeafNodes, rowsHierarchy, cfg, facet, false);

  // width / height for header area
  // 无论怎么变 都是以$$column$$来做判断，别问我为什么，我也是看规律发现的
  colsHierarchy.height = _.get(
    colCfg,
    'heightByField.$$column$$',
    cellCfg.height,
  );
  _.each(rootNode.children, (node) => {
    if (node) {
      colsHierarchy.width += node.width;
      // 每个node高度以最高的为标准~
      node.height = colsHierarchy.height;
    }
  });

  return {
    colLeafNodes,
    colsHierarchy,
  } as ColsResult;
}
