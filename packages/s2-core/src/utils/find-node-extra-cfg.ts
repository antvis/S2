import { Extra, StrategyValue } from '../common/interface';
import _ from 'lodash';

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
