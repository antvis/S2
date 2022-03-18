import {
  getSubTotalNodeWidthOrHeightByLevel,
  getIndexRangeWithOffsets,
} from '@/utils/facet';

describe('Facet util test', () => {
  test('should get correct width of subTotal node', () => {
    const sampleNodesForAllLevels = [
      {
        id: 'root[&]测试',
        value: '测试',
        isSubTotals: true,
        width: 20,
        level: 0,
      },
    ];
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getSubTotalNodeWidthOrHeightByLevel(sampleNodesForAllLevels, -1, 'width'),
    ).toEqual(20);
    expect(getSubTotalNodeWidthOrHeightByLevel([], -1, 'width')).toEqual(0);
  });

  test('should get correct index range for given offsets', () => {
    const offsets = [0, 30, 60, 90, 120, 150, 160, 170, 190];
    expect(getIndexRangeWithOffsets(offsets, 0, 31)).toStrictEqual({
      start: 0,
      end: 1,
    });

    expect(getIndexRangeWithOffsets(offsets, 101, 200)).toStrictEqual({
      start: 3,
      end: 7,
    });
  });

  test('should get correct index range for invalid input', () => {
    const offsets = [0, 30, 60, 90, 120, 150, 160, 170, 190];
    expect(getIndexRangeWithOffsets(offsets, 0, -10)).toStrictEqual({
      start: 0,
      end: 0,
    });
  });
});
