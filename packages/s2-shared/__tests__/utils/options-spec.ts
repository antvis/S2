import { DEFAULT_MOBILE_OPTIONS, DeviceType, LayoutWidthTypes } from '@antv/s2';
import { pick } from 'lodash';
import {
  getBaseSheetComponentOptions,
  getMobileSheetComponentOptions,
} from '../../src';

describe('Options Tests', () => {
  beforeEach(() => {
    window.devicePixelRatio = 2;
  });

  test('should get safety options', () => {
    const options = getBaseSheetComponentOptions();

    expect(options).toMatchInlineSnapshot();
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

    expect(options.tooltip).toMatchInlineSnapshot();
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

    expect(interactionOptions).toMatchInlineSnapshot();
    expect(options.style?.layoutWidthType).toEqual(
      LayoutWidthTypes.ColAdaptive,
    );
    expect(firstLevelOptions).toEqual({
      height: 380,
      device: DeviceType.MOBILE,
    });
  });
});
