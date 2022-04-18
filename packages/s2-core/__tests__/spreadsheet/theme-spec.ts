import { getContainer } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { get } from 'lodash';
import { ShapeAttrs } from '@antv/g-canvas';
import { PivotSheet } from '@/sheet-type';
import { TextAlign } from '@/common';
import { RowCell } from '@/cell';

describe('SpreadSheet Theme Tests', () => {
  let s2: PivotSheet;
  const dataCfg = assembleDataCfg();

  beforeAll(() => {
    s2 = new PivotSheet(
      getContainer(),
      dataCfg,
      assembleOptions({
        headerActionIcons: [
          {
            iconNames: ['DrillDownIcon'],
            belongsCell: 'rowCell',
            displayCondition: () => true,
            action: () => {},
          },
        ],
      }),
    );
  });

  afterAll(() => {
    s2.destroy();
  });

  describe('Custom SVG Icon Tests', () => {
    test('should set custom SVG icon size and color', () => {
      const iconInfo = {
        name: 'filter',
        size: 30,
        fill: 'red',
      };
      s2.setOptions({
        customSVGIcons: [
          {
            name: iconInfo.name,
            svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
          },
        ],
        headerActionIcons: [
          {
            iconNames: [iconInfo.name],
            belongsCell: 'rowCell',
          },
        ],
      });
      s2.setThemeCfg({
        theme: {
          rowCell: {
            icon: {
              size: iconInfo.size,
              fill: iconInfo.fill,
            },
            text: {
              fill: 'green',
            },
          },
        },
      });
      s2.render();
      const rowCell = s2.facet.rowHeader.getFirst() as RowCell;
      const actionIconCfg: ShapeAttrs = get(rowCell, 'actionIcons.[0].cfg');

      expect(actionIconCfg.fill).toEqual(iconInfo.fill);
      expect(actionIconCfg.name).toEqual(iconInfo.name);
      expect(actionIconCfg.width).toEqual(iconInfo.size);
      expect(actionIconCfg.height).toEqual(iconInfo.size);
    });
  });

  describe('Row Header Icon Tests', () => {
    const getRowCellThemeCfg = (textAlign: TextAlign) => {
      return {
        theme: {
          rowCell: {
            text: {
              textAlign,
            },
            bolderText: {
              textAlign,
            },
          },
        },
      };
    };

    const TEXT_ALIGNS: TextAlign[] = ['left', 'center', 'right'];

    test.each(TEXT_ALIGNS)(
      'should render correctly icon position when text %s aligned',
      (align: TextAlign) => {
        s2.setThemeCfg(getRowCellThemeCfg(align));
        s2.render();

        const rowCell = s2.facet.rowHeader.getFirst() as RowCell;

        const rowCellWidth = get(rowCell, 'meta.width');
        const actionIconCfg: ShapeAttrs = get(rowCell, 'actionIcons.[0].cfg');

        expect(actionIconCfg.x).toBeGreaterThanOrEqual(0);
        expect(actionIconCfg.x + actionIconCfg.width).toBeLessThanOrEqual(
          rowCellWidth,
        );
      },
    );
  });
});
