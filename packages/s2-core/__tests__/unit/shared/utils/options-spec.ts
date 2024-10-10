import type { S2Options } from '../../../../src';
import { getBaseSheetComponentOptions } from '../../../../src/shared';

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

    expect(options.tooltip).toMatchSnapshot();
  });
});
