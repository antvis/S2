import { PivotSheet, TableSheet } from '@antv/s2';
import { getMockSheetInstance } from 'tests/util/helpers';
import {
  generateSwitcherFieldsCfgFromResult,
  getSheetType,
} from '@/components/switcher/headerUtil';
import {
  generateSheetConfig,
  generateSwitcherFields,
} from '@/components/switcher/headerUtil';

describe('headerUtil test', () => {
  test('should return correct sheetType', () => {
    const sheet = getMockSheetInstance(PivotSheet);

    expect(getSheetType(sheet)).toEqual('pivot');
  });

  test('should generate correct switcher fields config for pivot sheet', () => {
    const sheet = getMockSheetInstance(PivotSheet);
    const dataCfg = {
      fields: {
        rows: ['row-a', 'row-b'],
        columns: ['col-a'],
        values: ['value-a', 'value-b', 'value-c'],
      },
      meta: [],
    };

    const hiddenColumnFields: string[] = [];

    const cfg = generateSwitcherFields(sheet, dataCfg, hiddenColumnFields);

    expect(cfg).toEqual({
      rows: {
        items: [
          {
            id: 'row-a',
            checked: true,
          },
          {
            id: 'row-b',
            checked: true,
          },
        ],
        selectable: false,
        expandable: false,
      },
      columns: {
        items: [
          {
            id: 'col-a',
            checked: true,
          },
        ],
        selectable: false,
        expandable: false,
      },
      values: {
        items: [
          {
            id: 'value-a',
            checked: true,
          },
          {
            id: 'value-b',
            checked: true,
          },
          {
            id: 'value-c',
            checked: true,
          },
        ],
        selectable: true,
        expandable: true,
      },
    });
  });

  test('should generate correct switcher fields config for table sheet', () => {
    const sheet = getMockSheetInstance(TableSheet);
    const dataCfg = {
      fields: {
        columns: ['col-a', 'col-b', 'col-c'],
      },
      meta: [],
    };

    const hiddenColumnFields: string[] = [];

    const cfg = generateSwitcherFields(sheet, dataCfg, hiddenColumnFields);

    expect(cfg).toEqual({
      columns: {
        items: [
          {
            id: 'col-a',
            checked: true,
          },
          {
            id: 'col-b',
            checked: true,
          },
          {
            id: 'col-c',
            checked: true,
          },
        ],
        selectable: true,
        expandable: false,
      },
    });
  });

  test('should generate correct switcher fields config for table sheet with existed hide column fields', () => {
    const sheet = getMockSheetInstance(TableSheet);
    const dataCfg = {
      fields: {
        columns: ['col-a', 'col-b', 'col-c'],
      },
      meta: [],
    };

    const hiddenColumnFields = ['col-a'];

    const cfg = generateSwitcherFields(sheet, dataCfg, hiddenColumnFields);

    expect(cfg).toEqual({
      columns: {
        items: [
          {
            id: 'col-a',
            checked: false,
          },
          {
            id: 'col-b',
            checked: true,
          },
          {
            id: 'col-c',
            checked: true,
          },
        ],
        selectable: true,
        expandable: false,
      },
    });
  });

  test('should generate correct result config for pivot sheet', () => {
    const sheet = getMockSheetInstance(PivotSheet);
    const result = {
      rows: {
        items: [{ id: 'row-a' }, { id: 'row-b' }, { id: 'row-c' }],
        hideItems: [{ id: 'row-c' }],
      },
      columns: {
        items: [{ id: 'col-a' }],
        hideItems: [],
      },
      values: {
        items: [{ id: 'value-b' }],
        hideItems: [],
      },
    };

    const cfg = generateSheetConfig(sheet, result);

    expect(cfg).toEqual({
      fields: {
        rows: ['row-a', 'row-b'],
        columns: ['col-a'],
        values: ['value-b'],
      },
    });
  });

  test('should generate correct result config for table sheet', () => {
    const sheet = getMockSheetInstance(TableSheet);
    const result = {
      rows: {
        items: [],
        hideItems: [],
      },
      columns: {
        items: [{ id: 'col-a' }, { id: 'col-b' }, { id: 'col-c' }],
        hideItems: [{ id: 'col-a' }],
      },
      values: {
        items: [],
        hideItems: [],
      },
    };

    const cfg = generateSheetConfig(sheet, result);

    expect(cfg).toEqual({
      fields: {
        rows: [],
        columns: ['col-a', 'col-b', 'col-c'],
        values: [],
      },
      hiddenColumnFields: ['col-a'],
    });
  });

  test('should generate correct switcher fields config from result for pivot sheet', () => {
    const sheet = getMockSheetInstance(PivotSheet);
    const result = {
      rows: {
        items: [],
        hideItems: [],
      },
      columns: {
        items: [{ id: 'col-a' }, { id: 'col-b' }, { id: 'col-c' }],
        hideItems: [{ id: 'col-a' }],
      },
      values: {
        items: [{ id: 'value-a' }, { id: 'value-b' }, { id: 'value-c' }],
        hideItems: [],
      },
    };

    const cfg = generateSwitcherFieldsCfgFromResult(sheet, result, [], []);

    expect(cfg).toEqual({
      columns: {
        items: [
          {
            id: 'col-a',
            checked: false,
          },
          {
            id: 'col-b',
            checked: true,
          },
          {
            id: 'col-c',
            checked: true,
          },
        ],
        selectable: false,
        expandable: false,
      },
      values: {
        items: [
          {
            id: 'value-a',
            checked: true,
          },
          {
            id: 'value-b',
            checked: true,
          },
          {
            id: 'value-c',
            checked: true,
          },
        ],
        selectable: true,
        expandable: true,
      },
    });
  });

  test('should generate correct switcher fields config from result for table sheet', () => {
    const sheet = getMockSheetInstance(TableSheet);
    const result = {
      rows: {
        items: [],
        hideItems: [],
      },
      columns: {
        items: [{ id: 'col-a' }, { id: 'col-b' }, { id: 'col-c' }],
        hideItems: [{ id: 'col-a' }],
      },
      values: {
        items: [],
        hideItems: [],
      },
    };

    const cfg = generateSwitcherFieldsCfgFromResult(sheet, result, [], []);

    expect(cfg).toEqual({
      columns: {
        items: [
          {
            id: 'col-a',
            checked: false,
          },
          {
            id: 'col-b',
            checked: true,
          },
          {
            id: 'col-c',
            checked: true,
          },
        ],
        selectable: true,
        expandable: false,
      },
    });
  });
});
