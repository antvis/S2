import type { AxisComponent } from '@antv/g2';
import type { Node, SpreadSheet } from '@antv/s2';
import { map } from 'lodash';

export function getAxisXOptions(meta: Node, s2: SpreadSheet): AxisComponent {
  const domain = map(meta.children, (child) => {
    const formatter = s2.dataSet.getFieldFormatter(child.field);

    return !child.isTotalRoot && formatter
      ? formatter(child.value, undefined, child)
      : child.value;
  });

  return {
    type: 'axisX',
    scale: {
      x: {
        type: 'band',
        domain,
        range: [0, 1],
      },
    },
  };
}

export function getAxisYOptions(meta: Node, s2: SpreadSheet): AxisComponent {
  const { field, value } = meta;

  const range = s2.dataSet.getValueRangeByField(value);

  return {
    type: 'axisY',
    title: s2.dataSet.getFieldFormatter(field)?.(value),
    titleSpacing: 0,
    scale: {
      y: {
        type: 'linear',
        domain: [range.minValue, range.maxValue],
        range: [1, 0],
      },
    },
    labelAutoRotate: false,
    labelAlign: 'horizontal',
    labelAutoWrap: true,
    line: false,
    grid: false,
  };
}
