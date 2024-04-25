import { getDataCellIconStyle, normalizeIconCfg } from '@/utils/layout/icon';

describe('normalizeIconCfg Test', () => {
  test('should return a complete IconCfg object', () => {
    expect(normalizeIconCfg()).toEqual({
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    });
  });

  test('should return the input object', () => {
    const iconCfg = {
      size: 10,
      position: 'left',
      margin: {
        left: 8,
        right: 8,
      },
    };

    expect(normalizeIconCfg(iconCfg)).toEqual(iconCfg);
  });
});

describe('getDataCellIconStyle Test', () => {
  const conditions = [
    {
      field: 'value',
      mapping: () => ({ fill: 'red' }),
    },
    { field: 'price', mapping: () => ({ fill: 'blue' }) },
    { field: /price/, mapping: () => ({ fill: 'orange' }), position: 'left' },
    { field: 'p', mapping: () => ({ fill: 'pink' }) },
  ];

  test('should return default iconCfg object', () => {
    expect(
      getDataCellIconStyle(
        { icon: conditions },
        { size: 10, margin: { left: 4, right: 4 } },
        'errorField',
      ),
    ).toEqual({
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    });
    expect(
      getDataCellIconStyle(
        { icon: [] },
        { size: 10, margin: { left: 4, right: 4 } },
        'price',
      ),
    ).toEqual({
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    });
  });
  test('should return correct iconCfg object', () => {
    expect(
      getDataCellIconStyle(
        { icon: conditions },
        { size: 10, margin: { left: 4, right: 4 } },
        'price',
      ),
    ).toEqual({
      size: 10,
      position: 'left',
      margin: {
        left: 4,
        right: 4,
      },
    });
  });
});
