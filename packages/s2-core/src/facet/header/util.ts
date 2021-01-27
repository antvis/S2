import * as _ from '@antv/util';

export const getCellPadding = () => {
  const padding = [12, 4, 12, 4];
  const left = _.isNil(padding[3]) ? 0 : padding[3];
  const right = _.isNil(padding[1]) ? 0 : padding[1];
  const top = _.isNil(padding[0]) ? 0 : padding[0];
  const bottom = _.isNil(padding[2]) ? 0 : padding[2];
  return {
    left,
    right,
    top,
    bottom,
  };
};
