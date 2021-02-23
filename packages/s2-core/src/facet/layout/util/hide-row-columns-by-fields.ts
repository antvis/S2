/**
 * Create By Bruce Too
 * On 2020-03-30
 */
import * as _ from 'lodash';
import { BaseSpreadSheet } from '../../../index';
import { SpreadsheetFacet } from '../../index';
import { Node } from '../node';

/**
 * Check if hide the specific field columns
 * 1、Config by hideRowColFields(handle by row, col field)
 * 2、hide row's cell when cell is empty in tree mode
 * @param ss
 * @param facet
 * @param node
 * @param inRow
 */
export default function hideRowColumnsByFields(
  ss: BaseSpreadSheet,
  facet: SpreadsheetFacet,
  node: Node,
  inRow = false,
) {
  const hideFields = _.get(ss, 'options.hideRowColFields', []);
  const { rows, cols } = facet.cfg;
  const fields = [...rows, ...cols];
  _.each(hideFields, (field) => {
    if (_.find(fields, (value) => value === field) && node.field === field) {
      node.hideRowNode();
    }
  });
  if (inRow && ss.isHierarchyTreeType() && node.inCollapseNode) {
    node.hideRowNode();
  }
}
