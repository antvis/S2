import {
  size,
  includes,
  isEmpty,
  each,
  merge,
  isBoolean,
  remove,
} from 'lodash';
import { i18n } from "src/common/i18n";
import { SpreadsheetFacetCfg } from "src/common/interface";
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import TotalClass from '../total-class';
import { canNodeBeExpanded } from './can-node-be-expanded';
import getDimsCondition from './get-dims-condition-by-node';
import { EXTRA_FIELD } from "src/common/constant";
import { generateId } from './generate-id';

function addTotalsNodes(
  cfg: SpreadsheetFacetCfg,
  field: string,
  fieldValues: (string | TotalClass)[],
  isSubTotals: boolean,
) {
  const totalsConfig = cfg.dataSet.getTotalsConfig(field);
  const option = isSubTotals
    ? totalsConfig.showSubTotals
    : totalsConfig.showGrandTotals;
  if (option) {
    const func = isSubTotals
      ? totalsConfig.reverseSubLayout
        ? 'unshift'
        : 'push'
      : totalsConfig.reverseLayout
      ? 'unshift'
      : 'push';
    const value = isSubTotals
      ? new TotalClass(totalsConfig.subLabel, true)
      : new TotalClass(totalsConfig.label, false, true);
    fieldValues[func](value);
  }
}

function handleTotals(
  currentField: string,
  fields: string[],
  index,
  fieldValues: (string | TotalClass)[],
  cfg: SpreadsheetFacetCfg,
) {
  // put all totals nodes in appropriate place
  if (currentField !== fields[0]) {
    // sub totals from 1 to length - 1
    const previousField = fields[index - 1];
    // NOTE: if current field's only has one child, we don't need sub totals
    if (size(fieldValues) > 1) {
      // [a, b, c] (start from second index, b -> a, c -> b)
      addTotalsNodes(cfg, previousField, fieldValues, true);
    }
  } else if (currentField === fields[0]) {
    // grand totals in first field level
    // check if there are grand totals in first field
    addTotalsNodes(cfg, fields[0], fieldValues, false);
  }
}

export default function buildHeaderHierarchy(
  parent: Node,
  currentField: string,
  fields: string[],
  cfg: SpreadsheetFacetCfg,
  hierarchy: Hierarchy,
) {
  const index = fields.indexOf(currentField);
  const key = currentField;
  const query = getDimsCondition(parent, true);
  const fieldValues: (string | TotalClass)[] = cfg.dataSet.getSortedDimensionValues(key, query);

  // when cols/values not exist,we need show table structure with empty body
  if (key === EXTRA_FIELD && includes(cfg.cols, key) && isEmpty(fieldValues)) {
    // add empty measure node
    fieldValues.push('');
  }
  // handle totals nodes
  handleTotals(currentField, fields, index, fieldValues, cfg);
  const { collapsedCols } = cfg;
  // generate all nodes(normal and totals) of this field
  each(fieldValues, (col) => {
    const isTotal = col instanceof TotalClass;
    let value;
    if (isTotal) {
      value = i18n((col as TotalClass).label);
    } else {
      value = col;
    }
    const nodeQuery = merge({}, query, { [currentField]: value });
    const id = generateId(parent.id, value, cfg);
    if (!id) return;
    const isCollapsed = isBoolean(collapsedCols[id])
      ? collapsedCols[id]
      : false;
    const node = new Node({
      id,
      key,
      value,
      level: index,
      field: currentField,
      parent,
      isTotals: isTotal,
      isCollapsed,
      isSubTotals: isTotal ? (col as TotalClass).isSubTotals : false,
      isGrandTotals: isTotal ? (col as TotalClass).isGrandTotals : false,
      hierarchy,
      query: nodeQuery,
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

    if (index === fields.length - 1 || isTotal || isCollapsed) {
      node.isLeaf = true;
      hierarchy.pushIndexNode(node);
      node.rowIndex = hierarchy.getIndexNodes().length - 1;
    }
    if (canNodeBeExpanded(index < fields.length - 1, isCollapsed, isTotal)) {
      buildHeaderHierarchy(
        node,
        fields[index + 1],
        fields,
        cfg,
        hierarchy,
      );
    }
  });
}
