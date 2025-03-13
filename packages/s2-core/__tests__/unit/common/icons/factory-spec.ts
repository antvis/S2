import { keys } from 'lodash';
import { getIcon, registerIcon } from '../../../../src/common/icons/factory';
import * as InternalSvgIcons from '../../../../src/common/icons/svg';

describe('GuiIcon Factory Tests', () => {
  test('should get default icon', () => {
    const icons = keys(InternalSvgIcons);

    expect(icons).toHaveLength(22);
    icons.forEach((name) => {
      expect(getIcon(name)).toBeTruthy();
    });
  });

  test('should get correctly icon', () => {
    expect(getIcon('test')).toBeUndefined();
    expect(getIcon('')).toBeUndefined();
    expect(getIcon('🐸')).toBeUndefined();
    expect(getIcon('Plus')).toBeTruthy();
  });

  test('should register icon', () => {
    const svg = 'xxxx';

    registerIcon('test', svg);
    registerIcon('🐸', svg);
    expect(getIcon('test')).toEqual(svg);
    expect(getIcon('🐸')).toEqual(svg);
  });
});
