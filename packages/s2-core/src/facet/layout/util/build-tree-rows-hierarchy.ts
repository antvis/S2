import { merge, each, isEmpty, isBoolean, remove } from 'lodash';
import { i18n } from 'src/common/i18n';
import { SpreadSheetFacetCfg } from 'src/common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import TotalClass from '../total-class';
import { canNodeBeExpanded } from './can-node-be-expanded';
import getDimsCondition from './get-dims-condition-by-node';
import { reArrangeFieldValues } from './re-arrange-field-values';
import findNodeExtraCfg from '../../../utils/find-node-extra-cfg';
import { generateId } from './generate-id';
import { BaseDataSet } from "src/data-set";

export interface TreeParams {
  parent: Node;
  field: string;
  fields: string[];
  cfg: SpreadSheetFacetCfg;
  hierarchy: Hierarchy;
  dataSet: BaseDataSet;
  // check if this node in collapse node
  inCollapseNode: boolean;
}

export default function buildTreeRowsHierarchy(treeParams: TreeParams) {
  const {
    parent,
    field,
    fields,
    cfg,
    hierarchy,
    dataSet,
    inCollapseNode,
  } = treeParams;
  const index = fields.indexOf(field);
  const key = field;
  const query = getDimsCondition(parent, true);
  let fieldValues: (string | TotalClass)[] = dataSet.getDimensionValues(key, query);
  // re-arrange field values by subGrand values
  reArrangeFieldValues(query, field, fieldValues, dataSet);
  // custom re-arrange
  if (cfg.layoutArrange) {
    fieldValues = cfg.layoutArrange(
      cfg.spreadsheet,
      parent,
      field,
      fieldValues as string[],
    );
  }
  const totalsConfig = cfg.spreadsheet.getTotalsConfig(field);

  // tree mode only has grand totals, but if there are subTotals configs, it will
  // display in cross-area cell
  if (field === fields[0] && totalsConfig.showGrandTotals) {
    const func = totalsConfig.reverseLayout ? 'unshift' : 'push';
    fieldValues[func](new TotalClass(totalsConfig.label, false, true));
  }

  const { collapsedRows, hierarchyCollapse, values } = cfg;

  each(fieldValues, (col) => {
    const isTotal = col instanceof TotalClass;
    let value;
    let label;
    if (isTotal) {
      value = i18n((col as TotalClass).label);
      label = value;
    } else {
      value = col;
      label = value;
    }
    const id = generateId(parent.id, value, cfg);
    if (!id) return;

    // check if current node is collapsed first, or use hierarchy config
    let isCollapse = isBoolean(collapsedRows[id])
      ? collapsedRows[id]
      : hierarchyCollapse;
    if (isTotal) {
      // 总计用户不会有收缩状态
      isCollapse = false;
    }
    // 处理决策模式下，初始化节点的收缩状态，一次性！！
    if (isBoolean(collapsedRows[id]) || hierarchyCollapse) {
      // 有操作后节点的情况下，需要以操作的为准，isCollapse不变
    } else {
      // 没有操作的过节点的情况下，默认以配置为准
      const extra = findNodeExtraCfg(values, { [field]: value });
      // 必须不为空
      if (extra && !isEmpty(label)) {
        isCollapse = extra.collapse;
      }
    }
    const node = new Node({
      id,
      key,
      label,
      value,
      level: index,
      parent,
      field,
      isTotals: isTotal,
      isCollapsed: isCollapse,
      hierarchy,
      query: merge({}, query, { [field]: value }),
      inCollapseNode,
      spreadsheet: cfg.spreadsheet,
    });
    if (cfg.hierarchy) {
      const another = cfg.hierarchy(cfg.spreadsheet, node);
      const push = another?.push;
      if (another.nodes.length > 0) {
        // 存在节点，按push 或者 unshift插入
        if (push) {
          hierarchy.pushNode(node);
        }
        each(another.nodes, (v) => {
          hierarchy.pushNode(v);
        });
        if (!push) {
          // new node insert before current
          hierarchy.pushNode(node);
          // adjust the index of current node
          remove(parent.children, (v) => v === node);
          parent.children.push(node);
        }
      } else {
        // 不存在节点，正常插入
        hierarchy.pushNode(node);
      }
    } else {
      // no extra node exist
      hierarchy.pushNode(node);
    }

    if (index > hierarchy.maxLevel) {
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = index;
    }

    if (index === fields.length - 1 || isTotal) {
      node.isLeaf = true;
      hierarchy.pushIndexNode(node);
      node.rowIndex = hierarchy.getIndexNodes().length - 1;
    }
    // collapsed node and totals don't have branches
    /**
     * Tree rows hierarchy now has different ways to handle node
     * Old strategy: use isCollapse to determine if render next level nodes(if true, we dont have
     * nodes in next level)
     * New strategy: use inCollapseNode, the next level's nodes still exist, but we "collapse" them
     * by height === 0, check {@hideRowColumnsByFields#l30}
     */
    if (canNodeBeExpanded(index < fields.length - 1, false, isTotal)) {
      buildTreeRowsHierarchy({
        parent: node,
        field: fields[index + 1],
        fields,
        cfg,
        hierarchy,
        dataSet,
        inCollapseNode: isCollapse || inCollapseNode,
      } as TreeParams);
    }
  });
}
