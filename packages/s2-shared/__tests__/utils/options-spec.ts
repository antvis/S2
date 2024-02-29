import { type S2Options } from '@antv/s2';
import { getBaseSheetComponentOptions } from '../../src';

describe('Options Tests', () => {
  test('should get safety options', () => {
    const options = getBaseSheetComponentOptions();

    expect(options).toMatchSnapshot();
  });

  test('should get custom options', () => {
    const tooltipOptions: S2Options = {
      tooltip: {
        enable: false,
        operation: {
          sort: false,
          menu: {
            items: [
              {
                key: 'custom',
                label: 'custom',
              },
            ],
          },
        },
      },
    };
    const options = getBaseSheetComponentOptions(tooltipOptions);

    expect(options.tooltip).toMatchInlineSnapshot(`
      Object {
        "autoAdjustBoundary": "body",
        "enable": false,
        "operation": Object {
          "hiddenColumns": true,
          "menu": Object {
            "items": Array [
              Object {
                "key": "custom",
                "label": "custom",
              },
            ],
          },
          "sort": false,
        },
      }
    `);
  });
});
