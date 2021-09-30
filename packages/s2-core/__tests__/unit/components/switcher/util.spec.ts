import { FieldType } from '@/components/switcher/constant';
import {
  SwitcherItem,
  SwitcherState,
  SwitcherFields,
} from '@/components/switcher/interface';
import {
  getNonEmptyFieldCount,
  getSwitcherState,
  getSwitcherClassName,
  getMainLayoutClassName,
  shouldCrossRows,
  moveItem,
  checkItem,
  generateSwitchResult,
} from '@/components/switcher/util';

describe('switcher util test', () => {
  test('should return correct class name with prefix', () => {
    expect(getSwitcherClassName('content', 'text')).toEqual(
      'antv-s2-switcher-content-text',
    );
  });
  test('should return correct non empty count', () => {
    const fields: SwitcherFields = {};
    expect(getNonEmptyFieldCount(fields)).toBe(0);

    fields[FieldType.Rows] = { items: [{ id: 'id' }] };
    expect(getNonEmptyFieldCount(fields)).toBe(1);

    fields[FieldType.Cols] = { items: [{ id: 'id' }] };
    expect(getNonEmptyFieldCount(fields)).toBe(2);

    fields[FieldType.Values] = { items: [{ id: 'id' }] };
    expect(getNonEmptyFieldCount(fields)).toBe(3);
  });

  test.each([
    { nonEmpty: 1, expected: 'antv-s2-switcher-content-one-dimension' },
    { nonEmpty: 2, expected: 'antv-s2-switcher-content-two-dimensions' },
    { nonEmpty: 3, expected: 'antv-s2-switcher-content-three-dimensions' },
  ])(
    'should return $expected when give nonempty number is $nonEmpty',
    ({ nonEmpty, expected }) => {
      expect(getMainLayoutClassName(nonEmpty)).toBe(expected);
    },
  );

  test('should return true if nonempty count is less than max count', () => {
    expect(shouldCrossRows(2, FieldType.Rows)).toBeTrue();
  });

  test('should return true if nonempty count is greater than max count', () => {
    expect(shouldCrossRows(3, FieldType.Rows)).toBeFalse();
    expect(shouldCrossRows(4, FieldType.Rows)).toBeFalse();
  });

  test('should return true if field type is value', () => {
    expect(shouldCrossRows(1, FieldType.Values)).toBeTrue();
  });

  describe('move item test', () => {
    const source: SwitcherItem[] = [
      {
        id: 's1',
      },
      {
        id: 's2',
      },
      {
        id: 's3',
      },
      {
        id: 's4',
      },
    ];

    const destination: SwitcherItem[] = [
      {
        id: 'd1',
      },
      {
        id: 'd2',
      },
      {
        id: 'd3',
      },
      {
        id: 'd4',
      },
    ];

    test('should change item index when move it in same column', () => {
      expect(
        moveItem(
          source,
          source,
          { droppableId: FieldType.Rows, index: 0 },
          { droppableId: FieldType.Rows, index: 2 },
        ),
      ).toEqual({
        [FieldType.Rows]: [
          {
            id: 's2',
          },
          {
            id: 's3',
          },
          {
            id: 's1',
          },
          {
            id: 's4',
          },
        ],
      });
    });

    test('should move item into another column when move it in different column', () => {
      expect(
        moveItem(
          source,
          destination,
          { droppableId: FieldType.Rows, index: 0 },
          { droppableId: FieldType.Cols, index: 2 },
        ),
      ).toEqual({
        [FieldType.Rows]: [
          {
            id: 's2',
          },
          {
            id: 's3',
          },

          {
            id: 's4',
          },
        ],
        [FieldType.Cols]: [
          {
            id: 'd1',
          },
          {
            id: 'd2',
          },
          {
            id: 's1',
          },
          {
            id: 'd3',
          },
          {
            id: 'd4',
          },
        ],
      });
    });
  });

  describe('check item test', () => {
    const source: SwitcherItem[] = [
      {
        id: 's1',
        children: [
          {
            id: 'sc1',
          },
          {
            id: 'sc2',
          },
        ],
      },
      {
        id: 's2',
      },
    ];

    test('should check single item when it has parent', () => {
      expect(checkItem(source, true, 'sc2', 's1')).toEqual([
        {
          id: 's1',
          children: [
            {
              id: 'sc1',
            },
            {
              id: 'sc2',
              checked: true,
            },
          ],
        },
        {
          id: 's2',
        },
      ]);
    });

    test('should check item with its children when it is root item', () => {
      expect(checkItem(source, true, 's1')).toEqual([
        {
          id: 's1',
          checked: true,
          children: [
            {
              id: 'sc1',
              checked: true,
            },
            {
              id: 'sc2',
              checked: true,
            },
          ],
        },
        {
          id: 's2',
        },
      ]);
    });
  });

  describe('generate result test', () => {
    let state: SwitcherState;

    beforeEach(() => {
      state = {
        [FieldType.Rows]: [
          {
            id: 'r1',
          },
          {
            id: 'r2',
          },
        ],
        [FieldType.Cols]: [
          {
            id: 'c1',
          },
          {
            id: 'c2',
          },
        ],
        [FieldType.Values]: [
          {
            id: 'v1',
          },
          {
            id: 'v2',
          },
        ],
      };
    });
    test('should return generate switch result when values have no children', () => {
      expect(generateSwitchResult(state)).toEqual({
        rows: {
          items: [
            {
              id: 'r1',
            },
            {
              id: 'r2',
            },
          ],
          hideItems: [],
        },
        columns: {
          items: [
            {
              id: 'c1',
            },
            {
              id: 'c2',
            },
          ],
          hideItems: [],
        },
        values: {
          items: [
            {
              id: 'v1',
            },
            {
              id: 'v2',
            },
          ],
          hideItems: [],
        },
      });
    });

    test('should return generate switch result when values have children', () => {
      state.values = [
        {
          id: 'v1',
          children: [
            {
              id: 'vc1',
            },
            {
              id: 'vc2',
            },
          ],
        },
        {
          id: 'v2',
        },
      ];

      expect(generateSwitchResult(state)).toEqual({
        rows: {
          items: [
            {
              id: 'r1',
            },
            {
              id: 'r2',
            },
          ],
          hideItems: [],
        },
        columns: {
          items: [
            {
              id: 'c1',
            },
            {
              id: 'c2',
            },
          ],
          hideItems: [],
        },
        values: {
          items: [
            {
              id: 'v1',
            },
            {
              id: 'vc1',
            },
            {
              id: 'vc2',
            },
            {
              id: 'v2',
            },
          ],
          hideItems: [],
        },
      });
    });

    test('should return generate switch result when values have hidden children', () => {
      state.values = [
        {
          id: 'v1',
          children: [
            {
              id: 'vc1',
              checked: false,
            },
            {
              id: 'vc2',
            },
          ],
        },
        {
          id: 'v2',
          checked: false,
          children: [
            {
              id: 'vc3',
              checked: false,
            },
          ],
        },
      ];
      expect(generateSwitchResult(state)).toEqual({
        rows: {
          items: [
            {
              id: 'r1',
            },
            {
              id: 'r2',
            },
          ],
          hideItems: [],
        },
        columns: {
          items: [
            {
              id: 'c1',
            },
            {
              id: 'c2',
            },
          ],
          hideItems: [],
        },
        values: {
          items: [
            {
              id: 'v1',
            },
            {
              id: 'vc1',
              checked: false,
            },
            {
              id: 'vc2',
            },
            {
              id: 'v2',
              checked: false,
            },
            {
              id: 'vc3',
              checked: false,
            },
          ],
          hideItems: [
            {
              id: 'vc1',
              checked: false,
            },
            {
              id: 'v2',
              checked: false,
            },
            {
              id: 'vc3',
              checked: false,
            },
          ],
        },
      });
    });
  });

  test('should return switcher state from switcher fields', () => {
    const fields: SwitcherFields = {
      rows: {
        items: [{ id: 'row' }],
      },
      columns: {
        items: [{ id: 'column' }],
      },
      values: {
        items: [{ id: 'value' }],
      },
    };
    expect(getSwitcherState(fields)).toEqual({
      rows: [{ id: 'row' }],
      columns: [{ id: 'column' }],
      values: [{ id: 'value' }],
    });
  });
});
