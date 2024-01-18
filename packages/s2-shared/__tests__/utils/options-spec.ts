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

    expect(options).toMatchInlineSnapshot(`
      Object {
        "conditions": Object {},
        "cornerExtraFieldText": "",
        "cornerText": "",
        "customSVGIcons": Array [],
        "debug": false,
        "device": "pc",
        "frozen": Object {
          "colCount": 0,
          "rowCount": 0,
          "rowHeader": true,
          "trailingColCount": 0,
          "trailingRowCount": 0,
        },
        "hdAdapter": true,
        "headerActionIcons": Array [],
        "height": 480,
        "hierarchyType": "grid",
        "interaction": Object {
          "autoResetSheetStyle": true,
          "brushSelection": Object {
            "colCell": false,
            "dataCell": true,
            "rowCell": false,
          },
          "eventListenerOptions": false,
          "hiddenColumnFields": Array [],
          "hoverFocus": Object {
            "duration": 800,
          },
          "hoverHighlight": true,
          "linkFields": Array [],
          "multiSelection": true,
          "overscrollBehavior": "auto",
          "rangeSelection": true,
          "resize": Object {
            "colCellHorizontal": true,
            "colCellVertical": true,
            "colResizeType": "current",
            "cornerCellHorizontal": true,
            "rowCellVertical": true,
            "rowResizeType": "current",
          },
          "scrollSpeedRatio": Object {
            "horizontal": 1,
            "vertical": 1,
          },
          "scrollbarPosition": "content",
          "selectedCellHighlight": false,
          "selectedCellsSpotlight": false,
        },
        "placeholder": "-",
        "showDefaultHeaderActionIcon": true,
        "showSeriesNumber": false,
        "style": Object {
          "colCell": Object {
            "height": 30,
            "heightByField": null,
            "widthByField": null,
          },
          "dataCell": Object {
            "height": 30,
            "width": 96,
          },
          "layoutWidthType": "adaptive",
          "rowCell": Object {
            "heightByField": null,
            "showTreeLeafNodeAlignDot": false,
            "widthByField": null,
          },
        },
        "tooltip": Object {
          "autoAdjustBoundary": "body",
          "enable": true,
          "operation": Object {
            "hiddenColumns": true,
            "menu": Object {
              "items": Array [],
            },
            "sort": true,
          },
        },
        "totals": Object {},
        "width": 600,
      }
    `);
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
