import { DEFAULT_MOBILE_OPTIONS, DeviceType, LayoutWidthTypes } from '@antv/s2';
import { pick } from 'lodash';
import {
  getBaseSheetComponentOptions,
  getMobileSheetComponentOptions,
} from '../../src';

describe('Options Tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 2,
      configurable: true,
    });
  });

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
        "devicePixelRatio": 2,
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
        "supportCSSTransform": false,
        "tooltip": Object {
          "autoAdjustBoundary": "body",
          "operation": Object {
            "hiddenColumns": true,
            "menus": Array [],
            "sort": true,
          },
          "showTooltip": true,
        },
        "totals": Object {},
        "width": 600,
      }
    `);
  });

  test('should get custom options', () => {
    const options = getBaseSheetComponentOptions({
      tooltip: {
        showTooltip: false,
        operation: {
          sort: false,
          menus: [
            {
              key: 'custom',
              text: 'custom',
            },
          ],
        },
      },
    });

    expect(options.tooltip).toMatchInlineSnapshot(`
      Object {
        "autoAdjustBoundary": "body",
        "operation": Object {
          "hiddenColumns": true,
          "menus": Array [
            Object {
              "key": "custom",
              "text": "custom",
            },
          ],
          "sort": false,
        },
        "showTooltip": false,
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
    expect(options.style?.layoutWidthType).toEqual(
      LayoutWidthTypes.ColAdaptive,
    );
    expect(firstLevelOptions).toEqual({
      height: 380,
      device: DeviceType.MOBILE,
    });
  });
});
