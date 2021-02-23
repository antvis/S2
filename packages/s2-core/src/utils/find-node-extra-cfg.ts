/**
 * Create By Bruce Too
 * On 2020-05-25
 */
import { Extra, StrategyValue } from '../common/interface';
import * as _ from 'lodash';

export default function findNodeExtraCfg(
  values: string[] | StrategyValue,
  find,
): Extra {
  const findExtra = null;
  if (!_.isArray(values) && !_.isEmpty(values.extra)) {
    return _.find(values.extra, (e) => _.isEqual(e.key, find));
  }
  return findExtra;
}
