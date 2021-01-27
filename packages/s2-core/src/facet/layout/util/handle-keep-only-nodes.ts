import { each } from '@antv/util';
import _ from 'lodash';
import { Pivot } from '../../../data-set';
import TotalClass from '../total-class';

/**
 * Create By Bruce Too
 * On 2019-11-13
 */
export function handleKeepOnlyNodes(
  pivot: Pivot,
  fieldValues: (string | TotalClass)[],
  field: string,
  parentId: string,
) {
  const keepValues = [];
  const nodeInRow = _.includes(pivot.config.rows, field);
  const keepOnlys = nodeInRow
    ? _.get(pivot.getKeepOnlyNodesIds(), 'rowIds')
    : _.get(pivot.getKeepOnlyNodesIds(), 'colIds');
  each(fieldValues, (value) => {
    const currentId = `${parentId}-${value}`;
    let find;
    if (_.isEmpty(keepOnlys)) {
      find = true;
    } else {
      find = _.find(keepOnlys, (keepOnlyId) => {
        return (
          _.includes(keepOnlyId, currentId) || _.includes(currentId, keepOnlyId)
        );
      });
    }
    if (find) {
      keepValues.push(value);
    }
  });

  fieldValues.splice(0, fieldValues.length);
  fieldValues.push(...keepValues);
}
