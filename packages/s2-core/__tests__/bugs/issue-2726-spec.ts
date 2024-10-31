/**
 * @description spec for issue #2726
 * https://github.com/antvis/S2/issues/2726
 */
import { SpreadSheet } from '@/sheet-type';
import { LayoutWidthType, type S2Options } from '../../src';
import { createPivotSheet } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    layoutWidthType: LayoutWidthType.ColAdaptive,
  },
  showDefaultHeaderActionIcon: false,
};

describe('Col Adaptive Layout Tests', () => {
  const expectTextOverflowing = (s2: SpreadSheet) => {
    s2.facet.getCells().forEach((cell) => {
      expect(cell.getTextShape().isOverflowing()).toBeFalsy();
    });
  };

  test('should get max row header width by corner cell width', async () => {
    const s2 = createPivotSheet(s2Options);

    s2.setDataCfg({
      meta: [
        {
          field: 'province',
          name: '省份省份省份省份省份省份省份',
        },
        {
          field: 'city',
          name: '城市城市城市城市城市',
        },
      ],
    });

    await s2.render();

    const cornerNodeWidthList = s2.facet
      .getCornerNodes()
      .map((node) => Math.floor(node.width));

    expect(cornerNodeWidthList).toEqual([185, 137, 322]);
    expectTextOverflowing(s2);
  });
});
