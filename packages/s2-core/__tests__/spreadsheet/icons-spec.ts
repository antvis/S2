import { getContainer } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { get } from 'lodash';
import { PivotSheet } from '@/sheet-type';
import { TextAlign, ThemeCfg } from '@/common';
import { RowCell } from '@/cell';

const getThemeCfg = (textAlign: TextAlign) => {
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
  } as ThemeCfg;
};

describe('Spreadsheet Row Header Icon Tests', () => {
  let spreadsheet: PivotSheet;
  const dataCfg = assembleDataCfg();

  beforeEach(() => {
    spreadsheet = new PivotSheet(
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

  test.each(['left', 'center', 'right'])(
    'should render icon when text %s aligned',
    (align: TextAlign) => {
      spreadsheet.setThemeCfg(getThemeCfg(align));
      spreadsheet.render();
      const rowCell = spreadsheet.facet.rowHeader.getFirst() as RowCell;

      const rowCellWidth = get(rowCell, 'meta.width');
      const iconStartX = get(rowCell, 'actionIcons.[0].cfg.x');
      const iconWidth = get(rowCell, 'actionIcons.[0].cfg.width');

      expect(iconStartX).toBeGreaterThanOrEqual(0);
      expect(iconStartX + iconWidth).toBeLessThanOrEqual(rowCellWidth);
    },
  );
});
