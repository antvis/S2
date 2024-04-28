import { type S2Options } from '@antv/s2';
import { getBaseSheetComponentOptions } from '../../../src/utils/options';

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
