import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import type { Group } from '@antv/g';
import {
  type S2Options,
  PivotSheet,
  KEY_GROUP_ROW_RESIZE_AREA,
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_GROUP_COL_RESIZE_AREA,
} from '../../src';

async function renderSheet(options?: S2Options) {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, {
    height: 150,
    ...options,
  });

  s2.setThemeCfg({
    theme: {
      resizeArea: {
        backgroundOpacity: 1,
      },
    },
  });

  await s2.render();

  return s2;
}

describe('SpreadSheet Resize Active Tests', () => {
  test('should show all resize area by default', async () => {
    const s2 = await renderSheet({} as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_ROW_RESIZE_AREA)).toBeDefined();
    expect(group.getElementById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeDefined();
    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeDefined();
  });

  test('should hide all resize area when set resize to false', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: false,
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_ROW_RESIZE_AREA)).toBeNull();
    expect(group.getElementById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeNull();
    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeNull();
  });

  test('should disable row cell resize area', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          rowCellVertical: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_ROW_RESIZE_AREA)).toBeNull();
  });

  test('should disable corner cell resize area', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          cornerCellHorizontal: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeNull();
  });

  test('should disable col cell resize area', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          colCellHorizontal: false,
          colCellVertical: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeNull();
  });

  // https://github.com/antvis/S2/issues/1603
  test('should disable col cell resize area if col is hidden', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          colCellHorizontal: false,
          colCellVertical: true,
        },
      },
    } as S2Options);

    s2.setOptions({
      style: {
        colCell: {
          height: 0,
        },
      },
    });

    await s2.render(false);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeNull();
  });

  test('should disable col cell vertical direction resize area', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          colCellVertical: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeDefined();
  });

  test('should disable col cell horizontal direction resize area', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          colCellHorizontal: false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    expect(group.getElementById(KEY_GROUP_COL_RESIZE_AREA)).toBeDefined();
  });

  test('should disable all cell resize area by visible', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          visible: () => false,
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;

    [
      KEY_GROUP_CORNER_RESIZE_AREA,
      KEY_GROUP_COL_RESIZE_AREA,
      KEY_GROUP_ROW_RESIZE_AREA,
    ].forEach((key) => {
      expect(group.getElementById(key)).toBeNull();
    });
  });

  test('should only show col cell resize area by visible', async () => {
    const s2 = await renderSheet({
      interaction: {
        resize: {
          visible: (cell) => {
            const meta = cell.getMeta();

            return meta.id === 'root[&]笔[&]price';
          },
        },
      },
    } as S2Options);

    const group = s2.facet.foregroundGroup;
    const colResizeGroups = (group.children as Group[]).filter(
      (element) => element.id === KEY_GROUP_COL_RESIZE_AREA,
    );

    expect(colResizeGroups).toHaveLength(1);
    expect(group.getElementById(KEY_GROUP_ROW_RESIZE_AREA)).toBeNull();
    expect(group.getElementById(KEY_GROUP_CORNER_RESIZE_AREA)).toBeNull();
  });

  test('should render correctly layout when tree row width is invalid number', async () => {
    const s2 = await renderSheet();

    s2.setOptions({
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          width: '@',
        },
      },
    });

    await s2.render(false);

    const nodes = s2.facet.getRowNodes().map((node) => {
      return {
        id: node.id,
        width: node.width,
        height: node.height,
      };
    });

    expect(nodes).toMatchSnapshot();
  });
});
