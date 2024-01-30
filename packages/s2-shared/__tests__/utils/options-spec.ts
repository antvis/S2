import {
  DEFAULT_MOBILE_OPTIONS,
  DeviceType,
  LayoutWidthType,
  type S2Options,
} from '@antv/s2';
import { pick } from 'lodash';
import {
  getBaseSheetComponentOptions,
  getMobileSheetComponentOptions,
} from '../../src';

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

  test('should get mobile options', () => {
    const options = getMobileSheetComponentOptions();
    const firstLevelOptions = pick(getMobileSheetComponentOptions(), [
      'height',
      'device',
    ]);
    const interactionOptions = pick(
      options.interaction,
      Object.keys(DEFAULT_MOBILE_OPTIONS.interaction!),
    );

    expect(interactionOptions).toMatchInlineSnapshot(`
      Object {
        "brushSelection": Object {
          "colCell": false,
          "dataCell": false,
          "rowCell": false,
        },
        "hoverFocus": false,
        "hoverHighlight": false,
        "multiSelection": false,
        "rangeSelection": false,
      }
    `);
    expect(options.style?.layoutWidthType).toEqual(LayoutWidthType.ColAdaptive);
    expect(firstLevelOptions).toEqual({
      height: 380,
      device: DeviceType.MOBILE,
    });
  });
});
