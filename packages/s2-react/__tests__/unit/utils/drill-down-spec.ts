import {
  PivotDataSet,
  RootInteraction,
  S2Options,
  Store,
  Node,
  SpreadSheet,
  PivotSheet,
} from '@antv/s2';
import { sleep, getContainer } from '../../util/helpers';
import { data as originData } from '../../data/mock-dataset.json';
import { data as drillDownData } from '../../data/mock-drill-down-dataset.json';
import {
  handleActionIconClick,
  handleDrillDown,
  handleDrillDownIcon,
  getDrillDownCache,
} from '@/utils';
import { PartDrillDown, PartDrillDownInfo } from '@/components';

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
    mockInstance = new PivotSheet(getContainer(), mockDataCfg, null);
    mockInstance.store = new Store();
    mockInstance.dataSet = new PivotDataSet(mockInstance);
    mockInstance.dataSet.setDataCfg(mockDataCfg);
    mockInstance.interaction = new RootInteraction(mockInstance);
    mockInstance.setOptions(mockOptions);
  });

  test('for handleDrillDown function', async () => {
    mockInstance.store.set('drillDownNode', cityNode);
    const drillDownCfg = {
      rows: mockDataCfg.fields.rows,
      drillFields: ['district'],
      fetchData,
      spreadsheet: mockInstance,
    };
    handleDrillDown(drillDownCfg);
    await sleep(1000);
    expect(mockInstance.store.get('drillDownDataCache')).not.toBeEmpty();
    expect(mockInstance.store.get('drillDownIdPathMap')).not.toBeEmpty();
  });

  test('for handleDrillDownIcon function', async () => {
    const mergedOptions = handleDrillDownIcon(
      {
        options: mockInstance.options,
        dataCfg: mockInstance.dataCfg,
        partDrillDown: mockPartDrillDown,
      },
      mockInstance,
      iconClickCallback,
      {
        current: null,
      },
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
    expect(mockInstance.store.get('drillDownNode')?.id).toEqual(
      'root[&]浙江省[&]杭州市',
    );
  });

  test('for getDrillDownCache function', async () => {
    const mockDrillDownDataCache = {
      rowId: 'root[&]浙江省[&]杭州市',
      drillLevel: 0,
      drillField: 'district',
      drillDownData,
    };
    mockInstance.store.set('drillDownDataCache', [mockDrillDownDataCache]);
    const { drillDownDataCache, drillDownCurrentCache } = getDrillDownCache(
      mockInstance,
      cityNode,
    );
    expect(drillDownDataCache).not.toBeEmpty();
    expect(drillDownCurrentCache).toEqual(mockDrillDownDataCache);
  });
});
