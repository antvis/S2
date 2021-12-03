import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import {
  KEY_GROUP_COL_RESIZE_AREA,
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  S2Options,
} from '@/common';

function renderSheet(options: S2Options) {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, {
    height: 200,
    ...options,
  });
  s2.setThemeCfg({
    theme: {
      resizeArea: {
        backgroundOpacity: 1,
      },
    },
  });
  s2.render();
  return s2;
}

describe('SpreadSheet Resize Active Tests', () => {
  test('should all resize area by default', () => {
    const s2 = renderSheet({} as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.findById(KEY_GROUP_ROW_RESIZE_AREA)).toBeDefined();
    expect(group.findById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeDefined();
    expect(group.findById(KEY_GROUP_COL_RESIZE_AREA)).toBeDefined();
  });

  test('should disable row cell resize area', () => {
    const s2 = renderSheet({
      interaction: {
        resizeActive: {
          enableRowCellVerticalResize: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;
    expect(group.findById(KEY_GROUP_ROW_RESIZE_AREA)).toBeNull();
  });

  test('should disable corner cell resize area', () => {
    const s2 = renderSheet({
      interaction: {
        resizeActive: {
          enableCornerCellHorizontalResize: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.findById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeNull();
  });

  test('should disable col cell resize area', () => {
    const s2 = renderSheet({
      interaction: {
        resizeActive: {
          enableColCellHorizontalResize: false,
          enableColCellVerticalResize: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.findById(KEY_GROUP_COL_RESIZE_AREA)).toBeNull();
  });
});
