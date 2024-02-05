/**
 * @description spec for issue #2359
 * https://github.com/antvis/S2/issues/2359
 * 明细表: 自定义列头误用 dataCell 样式
 */
import { pick } from 'lodash';
import { createTableSheet } from 'tests/util/helpers';
import { TableColCell, drawCustomContent } from '../../src';
import type { S2CellType, S2Options } from '@/common/interface';

class TestColCell extends TableColCell {
  drawTextShape() {
    drawCustomContent(this, {
      values: [['A', 'B', 'C']],
    });
  }
}

const s2Options: S2Options = {
  width: 300,
  height: 480,
  seriesNumber: {
    enable: true,
  },
  colCell: (...args) => new TestColCell(...args),
};

describe('Table Sheet Custom Multiple Values Tests', () => {
  test('should use current cell text theme', async () => {
    const s2 = createTableSheet(s2Options);

    s2.setTheme({
      colCell: {
        measureText: {
          fontSize: 12,
        },
        bolderText: {
          fontSize: 14,
        },
        text: {
          fontSize: 20,
          fill: 'red',
        },
      },
      dataCell: {
        text: {
          fontSize: 30,
          fill: 'green',
        },
      },
    });

    await s2.render();

    const mapTheme = (cell: S2CellType) => {
      return cell
        .getTextShapes()
        .map((shape) => pick(shape.attributes, ['fill', 'fontSize']));
    };

    const colCellTexts = s2.facet.getColCells().map(mapTheme);
    const dataCellTexts = s2.facet.getDataCells().map(mapTheme);

    expect(colCellTexts).toMatchSnapshot();
    expect(dataCellTexts).toMatchSnapshot();
  });
});
