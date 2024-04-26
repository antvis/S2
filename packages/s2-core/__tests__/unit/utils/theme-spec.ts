import { getPalette } from '../../../src/utils/theme';

describe('Theme Utils Tests', () => {
  test('should get correctly palette', () => {
    expect(getPalette()).toMatchSnapshot();
    expect(getPalette('default')).toMatchSnapshot();
    expect(getPalette('colorful')).toMatchSnapshot();
    expect(getPalette('gray')).toMatchSnapshot();
  });
});
