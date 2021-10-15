import { sleep } from 'tests/util/helpers';
import { data as originData } from '../../data/mock-dataset.json';
import { data as drillDownData } from '../../data/mock-drill-down-dataset.json';
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
      values: ['number'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'number',
        name: '数量',
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
    id: `root[&]浙江省`,
    key: '',
    value: '',
    field: 'province',
    parent: root,
  });
  const cityNode = new Node({
    id: `root[&]浙江省[&]杭州市`,
    key: '',
    value: '',
    field: 'city',
    parent: provinceNode,
  });

  const fetchData = () =>
    new Promise<PartDrillDownInfo>((resolve) => {
      const field = 'country';
      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    });

  const mockPartDrillDown = {
    drillConfig: {
      dataSet: [
        {
          name: '区域',
          value: 'district',
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
    mockInstance.options = mockOptions;
  });

  test('for HandleDrillDown function', async () => {
    mockInstance.store.set('drillDownNode', cityNode);
    const drillDownCfg = {
      rows: mockDataCfg.fields.rows,
      drillFields: ['district'],
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
      'root[&]浙江省[&]杭州市',
    );
  });

  test('for getDrillDownCash function', async () => {
    const mockDrillDownDataCache = {
      rowId: 'root[&]浙江省[&]杭州市',
      drillLevel: 0,
      drillField: 'district',
      drillDownData,
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
