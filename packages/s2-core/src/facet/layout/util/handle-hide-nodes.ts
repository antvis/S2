import * as _ from 'lodash';
import { Pivot } from '../../../data-set';
import TotalClass from '../total-class';

/**
 * Create By Bruce Too
 * On 2019-11-13
 */
export function handleHideNodes(
  pivot: Pivot,
  fieldValues: (string | TotalClass)[],
  field: string,
  parentId: string,
) {
  _.each(fieldValues, (value) => {
    const currentId = `${parentId}-${value}`;
    const find = _.find(pivot.getHideNodesIds(), (hideId) => {
      return _.isEqual(hideId, currentId);
    });
    if (find) {
      fieldValues.splice(fieldValues.indexOf(value), 1);
    }
  });
}
