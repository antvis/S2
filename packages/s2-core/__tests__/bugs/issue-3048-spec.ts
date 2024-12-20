/**
 * @description spec for issue #3048
 * https://github.com/antvis/S2/issues/3048
 */
import { createPivotSheet, sleep } from '../util/helpers';

describe('Merged Cells Scroll Tests', () => {
  test('should render correctly borders after scroll out of view', async () => {
    const s2 = createPivotSheet(
      {
        width: 800,
        height: 600,
        mergedCellsInfo: [
          [
            {
              rowIndex: 0,
              colIndex: 1,
            },
            {
              rowIndex: 1,
              colIndex: 1,
              showText: true,
            },
          ],
        ],
        style: {
          dataCell: {
            height: 150,
          },
        },
      },
      { useSimpleData: false },
    );

    await s2.render();

    // 让合并单元格滚动出可视范围内
    s2.interaction.scrollToBottom({ animate: false });
    await sleep(500);

    // 滚动回来
    s2.interaction.scrollToTop({ animate: false });
    await sleep(500);

    const mergedCellChildNodes = s2.facet
      .getMergedCells()[0]
      .children.map((node) => node.nodeName);

    // 边框线正常添加
    expect(mergedCellChildNodes).toEqual([
      'polygon',
      'text',
      'line',
      'line',
      'line',
    ]);
  });
});
