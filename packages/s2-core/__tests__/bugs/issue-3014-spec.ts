/**
 * @description spec for issue #3014
 * https://github.com/antvis/S2/issues/3014
 */
import { pick } from 'lodash';
import { createPivotSheet } from '../util/helpers';

describe('Cell SubPixel Render Tests', () => {
  test('should not render sub pixel cell', async () => {
    const s2 = createPivotSheet({
      width: 800,
      height: 600,
    });

    s2.setThemeCfg({
      name: 'colorful',
      theme: {
        background: {
          color: 'red',
        },
        cornerCell: {
          cell: {
            backgroundColor: '#ccc',
            horizontalBorderWidth: 0,
            verticalBorderColor: 'transparent',
            verticalBorderColorOpacity: 0,
          },
        },
      },
    });

    await s2.render();

    const sizeList = s2.facet
      .getRowNodes()
      .map((node) => pick(node, ['width', 'height']));

    expect(sizeList).toEqual([
      {
        width: 199,
        height: 60,
      },
      {
        width: 199,
        height: 30,
      },
      {
        width: 199,
        height: 30,
      },
    ]);
  });
});
