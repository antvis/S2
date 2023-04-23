/**
 * 行头多数值配置下，总计子节点宽度计算有误
 * @description spec for issue #2164
 * https://github.com/antvis/S2/issues/2164
 */

import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import type { S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  style: {
    layoutWidthType: 'compact',
  },
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
    },
  },
};

describe('Grand Total Row Node Tests', () => {
  const s2 = new PivotSheet(
    getContainer(),
    {
      ...mockDataConfig,
      fields: {
        ...mockDataConfig.fields,
        valueInCols: false, // 指标放行头
      },
    },
    s2Options,
  );
  s2.render();

  test("should calc correct grand total children nodes' width", () => {
    const { rowLeafNodes } = s2.facet.layoutResult;
    const totalLeafNode = rowLeafNodes.find((it) => it.isTotalMeasure);
    const normalLeafNode = rowLeafNodes.find((it) => !it.isTotalMeasure);

    expect(totalLeafNode.width).toEqual(normalLeafNode.width);
  });
});
