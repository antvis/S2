import { whetherLeafByLevel } from '../../../../src/utils/layout/whether-leaf-by-level';
import { createFakeSpreadSheet } from '../../../util/helpers';

describe('whether-leaf-by-level test', () => {
  test('should whether leaf by level', () => {
    const s2 = createFakeSpreadSheet();

    expect(
      whetherLeafByLevel({
        spreadsheet: s2,
        level: 0,
        fields: [],
      }),
    ).toEqual(false);

    expect(
      whetherLeafByLevel({
        spreadsheet: s2,
        level: 1,
        fields: ['a', 'b'],
      }),
    ).toEqual(true);
  });
});
