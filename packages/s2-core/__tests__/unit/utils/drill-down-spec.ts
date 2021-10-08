import { sleep } from 'tests/util/helpers';
import { originData, drillDownData1 } from '../../data/data-drill-down';
import { S2Options } from '@/common/interface';
import { Store } from '@/common/store';
import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type';
import {
  handleActionIconClick,
  HandleDrillDown,
  HandleDrillDownIcon,
  getDrillDownCash,
} from '@/utils';
import { PartDrillDown, PartDrillDownInfo } from '@/components';
import { PivotDataSet } from '@/data-set';

jest.mock('@/sheet-type');
const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('Drill Down Test', () => {
  let mockInstance: SpreadSheet;
  const mockDataCfg = {
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      values: ['price'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'price',
        name: '总价',
      },
    ],
    data: originData,
    sortParams: [],
  };

  const mockOptions = {
    hierarchyType: 'tree',
  } as S2Options;

  const root = new Node({ id: `root`, key: '', value: '', children: [] });
  const provinceNode = new Node({
    id: `root[&]辽宁省`,
    key: '',
    value: '',
    field: 'province',
    parent: root,
  });
  const cityNode = new Node({
    id: `root[&]辽宁省[&]达州市`,
    key: '',
    value: '',
    field: 'city',
    parent: provinceNode,
  });

  const fetchData = () =>
    new Promise<PartDrillDownInfo>((resolve) => {
      const field = 'country';
      const drillDownData = drillDownData1;
      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    });

  const mockPartDrillDown = {
    drillConfig: {
      dataSet: [
        {
          name: '县城',
          value: 'country',
          type: 'text',
        },
        {
          name: '村',
          value: 'village',
          type: 'text',
        },
      ],
    },
    fetchData,
  } as PartDrillDown;

  const iconClickCallback = jest.fn();

  beforeEach(() => {
    MockSpreadSheet.mockClear();
    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
    mockInstance.dataSet = new PivotDataSet(mockInstance);
    mockInstance.dataSet.setDataCfg(mockDataCfg);
    mockInstance.setOptions(mockOptions);
  });

  test('for HandleDrillDown function', async () => {
    mockInstance.store.set('drillDownNode', cityNode);
    const drillDownCfg = {
      rows: mockDataCfg.fields.rows,
      drillFields: ['country'],
      fetchData,
      spreadsheet: mockInstance,
    };
    HandleDrillDown(drillDownCfg);
    await sleep(1000);
    expect(mockInstance.store.get('drillDownDataCache')).not.toBeEmpty();
    expect(mockInstance.store.get('drillDownIdPathMap')).not.toBeEmpty();
  });

  test('for HandleDrillDownIcon function', async () => {
    const mergedOptions = HandleDrillDownIcon(
      {
        options: mockInstance.options,
        dataCfg: mockInstance.dataCfg,
        partDrillDown: mockPartDrillDown,
      },
      mockInstance,
      iconClickCallback,
    );
    expect(mergedOptions.headerActionIcons).not.toBeEmpty();
  });

  test('for handleActionIconClick function', async () => {
    handleActionIconClick({
      meta: cityNode,
      spreadsheet: mockInstance,
      callback: iconClickCallback,
      iconName: 'DrillDownIcon',
    });
    await sleep(1000);
    expect(mockInstance.store.get('drillDownMeta').id).toEqual(
      'root[&]辽宁省[&]达州市',
    );
  });

  test('for getDrillDownCash function', async () => {
    const mockDrillDownDataCache = {
      rowId: 'root[&]辽宁省[&]达州市',
      drillLevel: 0,
      drillField: 'country',
      drillDownData: drillDownData1,
    };
    mockInstance.store.set('drillDownDataCache', [mockDrillDownDataCache]);
    const { drillDownDataCache, drillDownCurrentCash } = getDrillDownCash(
      mockInstance,
      cityNode,
    );
    expect(drillDownDataCache).not.toBeEmpty();
    expect(drillDownCurrentCash).toEqual(mockDrillDownDataCache);
  });
});
