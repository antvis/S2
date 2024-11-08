/**
 * @description spec for issue #2957
 * https://github.com/antvis/S2/issues/2957
 */
import { PivotSheet } from '@/sheet-type';
import type { S2Options } from '../../src';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
};

describe('Corner Measure Text Tests', () => {
  test('should get correctly theme config with customValueOrder', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      {
        data: [
          {
            '4rweiwt7aneo': '上海市',
            '4w8pyhsbkkjk': '①正常库存',
            '4vynudxz28sg': '457',
            styleKey: 1,
          },
        ],
        fields: {
          valueInCols: true,
          rows: ['4rweiwt7aneo'],
          columns: ['4w8pyhsbkkjk'],
          values: ['4vynudxz28sg'],
          customValueOrder: 0,
        },
      },
      s2Options,
    );

    s2.setTheme({
      cornerCell: {
        measureText: {
          fill: 'blue',
          textAlign: 'center',
          fontSize: 12,
        },
      },
    });
    await s2.render();

    const extraFieldText = s2.facet.getCornerCells()[1].getTextShape();

    expect(extraFieldText.parsedStyle.textBaseline).toEqual('middle');
  });
});
