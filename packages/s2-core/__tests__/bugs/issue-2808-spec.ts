/**
 * @description spec for issue #2808
 * https://github.com/antvis/S2/issues/2808
 */
import { type S2Options } from '../../src';
import { createPivotSheet } from '../util/helpers';

describe('Cell Nill Value Tests', () => {
  const getCellMetaList = async (s2Options?: S2Options) => {
    const s2 = createPivotSheet(
      { width: 800, height: 600, ...s2Options },
      { useSimpleData: false },
    );

    const data = [
      {
        number: 7789,
        province: null,
        city: null,
        type: null,
        sub_type: null,
      },
      ...s2.dataCfg.data,
    ];

    s2.setDataCfg({
      data,
    });

    await s2.render();

    return s2.facet.getCells().map((cell) => {
      const meta = cell.getMeta();

      return {
        id: meta.id,
        value: meta.value || meta.fieldValue,
        actualText: cell.getActualText(),
      };
    });
  };

  test('should get correctly nill cell value', async () => {
    const metaList = await getCellMetaList();

    expect(metaList).toMatchSnapshot();
  });

  test('should get correctly empty placeholder cell value', async () => {
    const metaList = await getCellMetaList({
      placeholder: {
        cell: '我是占位符',
      },
    });

    expect(metaList).toMatchSnapshot();
  });
});
