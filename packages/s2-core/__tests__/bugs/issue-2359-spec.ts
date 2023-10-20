/**
 * @description spec for issue #2359
 * https://github.com/antvis/S2/issues/2359
 * 明细表: 自定义列头误用 dataCell 样式
 */
import { pick } from 'lodash';
import { createTableSheet } from 'tests/util/helpers';
import { TableColCell, drawObjectText } from '../../src';
import type { S2CellType, S2Options } from '@/common/interface';

class TestColCell extends TableColCell {
  drawTextShape() {
    drawObjectText(this, {
      values: [['A', 'B', 'C']],
    });
  }
}

const s2Options: S2Options = {
  width: 300,
  height: 480,
  showSeriesNumber: true,
  colCell: (...args) => new TestColCell(...args),
};

describe('Table Sheet Custom Multiple Values Tests', () => {
  test('should use current cell text theme', () => {
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
    s2.render();

    const mapTheme = (cell: S2CellType) => {
      return cell
        .getTextShapes()
        .map((shape) => pick(shape.attr(), ['fill', 'fontSize']));
    };

    const colCellTexts = s2
      .getColumnNodes()
      .map((node) => mapTheme(node.belongsCell));

    const dataCellTexts = s2.interaction
      .getPanelGroupAllDataCells()
      .map(mapTheme);

    expect(colCellTexts).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "fill": "red",
            "fontSize": 20,
          },
          Object {
            "fill": "red",
            "fontSize": 20,
          },
          Object {
            "fill": "red",
            "fontSize": 20,
          },
        ],
        Array [
          Object {
            "fill": "red",
            "fontSize": 20,
          },
          Object {
            "fill": "red",
            "fontSize": 20,
          },
          Object {
            "fill": "red",
            "fontSize": 20,
          },
        ],
      ]
    `);

    expect(dataCellTexts).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "fill": "#000000",
            "fontSize": 12,
          },
        ],
        Array [
          Object {
            "fill": "#000000",
            "fontSize": 12,
          },
        ],
        Array [
          Object {
            "fill": "#000000",
            "fontSize": 12,
          },
        ],
        Array [
          Object {
            "fill": "green",
            "fontSize": 30,
          },
        ],
        Array [
          Object {
            "fill": "green",
            "fontSize": 30,
          },
        ],
        Array [
          Object {
            "fill": "green",
            "fontSize": 30,
          },
        ],
      ]
    `);
  });
});
