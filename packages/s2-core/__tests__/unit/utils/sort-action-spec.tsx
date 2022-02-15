import { sortAction, sortByCustom } from '@/utils/sort-action';

describe('Sort Action Test', () => {
  describe('Sort Action', () => {
    test('sort action with number arr', () => {
      const data = [1, 3, 2];
      expect(sortAction(data, 'ASC')).toEqual([1, 2, 3]);
      expect(sortAction(data, 'DESC')).toEqual([3, 2, 1]);
    });

    test('sort action with number-string and number arr', () => {
      const data1 = ['11', '3', 2];
      expect(sortAction(data1, 'ASC')).toEqual(['11', 2, '3']);
      expect(sortAction(data1, 'DESC')).toEqual(['3', 2, '11']);

      const data2 = ['11', '3', '2'];
      expect(sortAction(data2, 'ASC')).toEqual(['11', '2', '3']);
      expect(sortAction(data2, 'DESC')).toEqual(['3', '2', '11']);
    });

    test('sort action with string arr', () => {
      const data = ['a', 'c', 'b'];
      expect(sortAction(data, 'ASC')).toEqual(['a', 'b', 'c']);
      expect(sortAction(data, 'DESC')).toEqual(['c', 'b', 'a']);

      const data1 = ['啊', '哦', '嗯'];
      expect(sortAction(data1, 'ASC')).toEqual(['啊', '嗯', '哦']);
      expect(sortAction(data1, 'DESC')).toEqual(['哦', '嗯', '啊']);

      const data2 = ['啊', '11', '2'];
      expect(sortAction(data2, 'ASC')).toEqual(['11', '2', '啊']);
      expect(sortAction(data2, 'DESC')).toEqual(['啊', '2', '11']);
    });

    test('sort action with object arr', () => {
      const data1 = [{ a: 1 }, { a: 3 }, { a: 2 }];
      expect(sortAction(data1, 'ASC', 'a')).toEqual([
        { a: 1 },
        { a: 2 },
        { a: 3 },
      ]);
      expect(sortAction(data1, 'DESC', 'a')).toEqual([
        { a: 3 },
        { a: 2 },
        { a: 1 },
      ]);

      const data2 = [{ a: '11' }, { a: '3' }, { a: 2 }];
      expect(sortAction(data2, 'ASC', 'a')).toEqual([
        { a: 2 },
        { a: '3' },
        { a: '11' },
      ]);
      expect(sortAction(data2, 'DESC', 'a')).toEqual([
        { a: '11' },
        { a: '3' },
        { a: 2 },
      ]);

      const data3 = [{ a: '-' }, { a: '3' }, { a: 2 }];
      expect(sortAction(data3, 'ASC', 'a')).toEqual([
        { a: '-' },
        { a: 2 },
        { a: '3' },
      ]);
      expect(sortAction(data3, 'DESC', 'a')).toEqual([
        { a: '3' },
        { a: 2 },
        { a: '-' },
      ]);

      expect(
        sortAction(
          [{ a: '-' }, { a: '3' }, { a: 2 }, { a: undefined }],
          'ASC',
          'a',
        ),
      ).toEqual([{ a: undefined }, { a: '-' }, { a: 2 }, { a: '3' }]);
      expect(
        sortAction(
          [{ a: '-' }, { a: '3' }, { a: 2 }, { a: undefined }],
          'DESC',
          'a',
        ),
      ).toEqual([{ a: '3' }, { a: 2 }, { a: '-' }, { a: undefined }]);
      expect(sortAction([{ a: '' }, { a: '3' }, { a: 2 }], 'ASC', 'a')).toEqual(
        [{ a: '' }, { a: 2 }, { a: '3' }],
      );
    });
  });
});

describe('Sort By Custom Test', () => {
  describe('Sort By Custom', () => {
    test('sort by custom with equal sub node', () => {
      const params = {
        originValues: [
          'Monday[&]noon',
          'Monday[&]afternoon',
          'Monday[&]morning',
          'Tuesday[&]afternoon',
          'Tuesday[&]noon',
          'Tuesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]morning',
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
      ]);
    });
    test('sort by custom with repeated sub node', () => {
      const params = {
        originValues: [
          'Monday[&]noon',
          'Monday[&]afternoon',
          'Tuesday[&]afternoon',
          'Tuesday[&]noon',
          'Tuesday[&]morning',
          'Wednesday[&]afternoon',
          'Wednesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
        'Wednesday[&]morning',
        'Wednesday[&]afternoon',
      ]);
    });
    test('sort by custom with unordered node', () => {
      const params = {
        originValues: [
          'Monday[&]afternoon',
          'Tuesday[&]afternoon',
          'Wednesday[&]afternoon',
          'Monday[&]noon',
          'Tuesday[&]noon',
          'Wednesday[&]morning',
          'Tuesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
        'Wednesday[&]morning',
        'Wednesday[&]afternoon',
      ]);
    });
  });
});
