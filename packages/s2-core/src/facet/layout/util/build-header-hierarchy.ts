import {
  size,
  includes,
  isEmpty,
  each,
  merge,
  isBoolean,
  remove,
  last
} from "lodash";
import { i18n } from "src/common/i18n";
import { SpreadSheetFacetCfg } from "src/common/interface";
import { Hierarchy } from "../hierarchy";
import { Node } from "../node";
import { TotalClass } from "../total-class";
import { canNodeBeExpanded } from "./can-node-be-expanded";
import getDimsCondition from "./get-dims-condition-by-node";
import { EXTRA_FIELD } from "src/common/constant";
import { generateId } from "./generate-id";
import { FileValue } from "src/facet/layout/interface";
import { DebuggerUtil } from "src/common/debug";
import { TotalMeasure } from "src/facet/layout/total-measure";

const addTotalsNodes = (
  cfg: SpreadSheetFacetCfg,
  field: string,
  fieldValues: FileValue[],
  isSubTotals: boolean
) => {
  const totalsConfig = cfg.spreadsheet.getTotalsConfig(field);
  const option = isSubTotals
    ? totalsConfig.showSubTotals
    : totalsConfig.showGrandTotals;
  if (option) {
    const func = isSubTotals
      ? totalsConfig.reverseSubLayout
        ? "unshift"
        : "push"
      : totalsConfig.reverseLayout
        ? "unshift"
        : "push";
    const value = isSubTotals
      ? new TotalClass(totalsConfig.subLabel, true)
      : new TotalClass(totalsConfig.label, false, true);
    fieldValues[func](value);
  }
};

const handleTotals = (
  currentField: string,
  fields: string[],
  index,
  fieldValues: FileValue[],
  cfg: SpreadSheetFacetCfg
) => {
  // put all totals nodes in appropriate place
  if (currentField !== fields[0]) {
    // sub totals from 1 to length - 1
    const previousField = fields[index - 1];
    // NOTE: if current field's only has one child, we don't need sub totals
    if (size(fieldValues) > 1 && currentField !== EXTRA_FIELD) {
      // [a, b, c] (start from second index, b -> a, c -> b)
      addTotalsNodes(cfg, previousField, fieldValues, true);
    }
  } else if (currentField === fields[0]) {
    // grand totals in first field level
    // check if there are grand totals in first field
    addTotalsNodes(cfg, fields[0], fieldValues, false);
  }
};

const addTotalMeasure = (
  currentField: string,
  fieldValues: FileValue[],
  cfg: SpreadSheetFacetCfg
) => {
  const { cols, values } = cfg;
  const valueInCols = cfg.spreadsheet?.dataCfg?.fields?.valueInCols;
  const fieldInCols = includes(cols, currentField);
  if (values.length > 1) {
    // 多个度量值，需要单独汇总
    if ((valueInCols && fieldInCols) || (!valueInCols && !fieldInCols)) {
      //「数值置于列，且现在是执行列节点」 或者 「数值置于行，且现在是执行行节点」
      const vs = values.map(value => new TotalMeasure(value));
      fieldValues.push(...vs);
    }
  }
};

const nodeIsLeaf = (
  lastField: boolean,
  currentField: string,
  fieldValue: FileValue,
  cfg: SpreadSheetFacetCfg,
  isCollapsed: boolean
) => {
  const { cols, values } = cfg;
  const valueInCols = cfg.spreadsheet?.dataCfg?.fields?.valueInCols;
  const fieldInCols = includes(cols, currentField);
  const isTotal = fieldValue instanceof TotalClass;
  const isTotalMeasure = fieldValue instanceof TotalMeasure;
  let customLeaf = false;
  if (values.length > 1) {
    if (valueInCols) {
      if (!fieldInCols) {
        customLeaf = isTotal;
      } else {
        customLeaf = isTotalMeasure;
      }
    } else {
      if (fieldInCols) {
        customLeaf = isTotal;
      } else {
        customLeaf = isTotalMeasure;
      }
    }
  } else {
    customLeaf = isTotal;
  }
  return lastField || isCollapsed || customLeaf;
};

export default function buildHeaderHierarchy(
  parent: Node,
  currentField: string,
  fields: string[],
  cfg: SpreadSheetFacetCfg,
  hierarchy: Hierarchy
) {
  const { cols, values } = cfg;
  const index = fields.indexOf(currentField);
  const fieldValues = [] as FileValue[];
  let query = {};
  if (!parent.isTotals) {
    // 非总计小计节点，直接从数据中去找
    query = getDimsCondition(parent, true);
    fieldValues.push(...cfg.dataSet.getDimensionValues(currentField, query));
    // handle totals nodes
    handleTotals(currentField, fields, index, fieldValues, cfg);
  } else {
    query = getDimsCondition(parent.parent, true);
    addTotalMeasure(currentField, fieldValues, cfg);
  }
  // when cols/values not exist,we need show table structure with empty body
  if (currentField === EXTRA_FIELD && includes(cfg.cols, currentField) && isEmpty(fieldValues)) {
    // add empty measure node
    fieldValues.push("");
  }
  const { collapsedCols } = cfg;
  // generate all nodes(normal and totals) of this field
  each(fieldValues, (fieldValue: FileValue) => {
    const isTotal = fieldValue instanceof TotalClass;
    const isTotalMeasure = fieldValue instanceof TotalMeasure;
    let value;
    let nodeQuery;
    if (isTotal) {
      value = i18n((fieldValue as TotalClass).label);
      nodeQuery = query;
    } else if (isTotalMeasure) {
      value = i18n((fieldValue as TotalMeasure).label);
      nodeQuery = merge({}, query, { [EXTRA_FIELD]: value });
    } else {
      value = fieldValue;
      nodeQuery = merge({}, query, { [currentField]: value });
    }
    DebuggerUtil.getInstance().logger('----', value, nodeQuery);
    const id = generateId(parent.id, value, cfg);
    const isCollapsed = isBoolean(collapsedCols[id])
      ? collapsedCols[id]
      : false;
    const node = new Node({
      id,
      key: currentField,
      value,
      level: index,
      field: currentField,
      parent,
      isTotals: isTotal,
      isCollapsed,
      isSubTotals: isTotal ? (fieldValue as TotalClass).isSubTotals : false,
      isGrandTotals: isTotal ? (fieldValue as TotalClass).isGrandTotals : false,
      hierarchy,
      query: nodeQuery,
      spreadsheet: cfg.spreadsheet
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

    if (nodeIsLeaf(index === fields.length - 1, currentField, fieldValue, cfg, isCollapsed)) {
      node.isLeaf = true;
      hierarchy.pushIndexNode(node);
      node.rowIndex = hierarchy.getIndexNodes().length - 1;
    }

    if (canNodeBeExpanded(index < fields.length - 1, isCollapsed, parent.isTotals)) {
      buildHeaderHierarchy(
        node,
        fields[index + 1],
        fields,
        cfg,
        hierarchy
      );
    }
  });
}
