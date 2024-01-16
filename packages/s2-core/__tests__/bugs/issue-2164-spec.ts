/**
 * 行头多数值配置下，总计子节点宽度计算有误
 * @description spec for issue #2164
 * https://github.com/antvis/S2/issues/2164
 */

import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import { LayoutWidthType, type S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  style: {
    layoutWidthType: LayoutWidthType.Compact,
  },
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
    },
  },
};

describe('Grand Total Row Node Tests', () => {
  test("should calc correct grand total children nodes' width", async () => {
    const s2 = new PivotSheet(
      getContainer(),
      {
        ...mockDataConfig,
        fields: {
          ...mockDataConfig.fields,
          // 指标放行头
          valueInCols: false,
        },
      },
      s2Options,
    );

    await s2.render();

    const rowLeafNodes = s2.facet.getRowLeafNodes();
    const totalLeafNode = rowLeafNodes.find((node) => node.isTotalMeasure)!;
    const normalLeafNode = rowLeafNodes.find((node) => !node.isTotalMeasure)!;

    expect(totalLeafNode.width).toEqual(normalLeafNode.width);
  });
});
