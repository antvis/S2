/**
 * @description spec for issue #2199
 * https://github.com/antvis/S2/issues/2199
 * 明细表: 当有冻结列 + 列分组的情况下, 会出现列头文本不居中现象
 */
import type { S2Options } from '@/common/interface';
import { TableSheet } from '@/sheet-type';
import { getContainer, sleep } from 'tests/util/helpers';
import dataCfg from '../data/data-issue-2199.json';

const s2Options: S2Options = {
  width: 300,
  height: 480,
  seriesNumber: {
    enable: true,
  },
  frozen: {
    colCount: 1,
  },
};

describe('ColCell Text Center Tests', () => {
  test('should draw text centered in cell', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    s2.interaction.scrollTo({
      offsetX: {
        value: 500,
        animate: false,
      },
    });

    await sleep(200);

    const node = s2.facet.getColNodes(0).slice(-1)?.[0];
    const cell = node?.belongsCell;
    const { width: nodeWidth, x: nodeX } = node;
    const { width: textWidth, x: textXActual } = cell!.getBBoxByType();
    const textXCalc = nodeX + (nodeWidth - textWidth) / 2;

    expect(textXCalc).toBeCloseTo(textXActual);
  });
});
