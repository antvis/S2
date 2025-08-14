/**
 * @description spec for issue #3212
 * https://github.com/antvis/S2/issues/3212
 */
import { createPivotSheet } from '../util/helpers';

describe('PivotSheet', () => {
  test('should keep column width after hiding value in compact mode', async () => {
    const dataCfg = await fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
    ).then((res) => res.json());

    // 增加几条长度不一致的 mock 数据
    dataCfg.data[0].number = 11111111;
    dataCfg.data[6].number = 7777;
    dataCfg.data[dataCfg.data.length - 1].number = 666666;
    const s2Options = {
      width: 600,
      height: 480,
      style: {
        // 了解更多: https://s2.antv.antgroup.com/api/general/s2-options#style
        layoutWidthType: 'compact',
      },
    };
    const s2 = createPivotSheet(s2Options, { useSimpleData: false });

    s2.setDataCfg(dataCfg);

    await s2.render();

    const colWidth = s2.facet.getColCells()[0].getMeta().width;

    s2.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });

    await s2.render();

    expect(s2.facet.getColCells()[0].getMeta().width).toBe(colWidth);
  });
});
