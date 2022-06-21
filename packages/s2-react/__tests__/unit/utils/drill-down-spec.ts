/**
 *
 */
import {
  PivotDataSet,
  RootInteraction,
  type S2Options,
  Store,
  Node,
  SpreadSheet,
  PivotSheet,
} from '@antv/s2';
import {
  buildDrillDownOptions,
  getDrillDownCache,
  handleActionIconClick,
  handleDrillDown,
  type PartDrillDown,
  type PartDrillDownInfo,
} from '@antv/s2-shared';
import { sleep, getContainer } from '../../util/helpers';
import { data as originData } from '../../data/mock-dataset.json';
import {
  data as drillDownData,
  HZDrillDownData,
  SXDrillDownData,
} from '../../data/mock-drill-down-dataset.json';

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
    mockInstance = new PivotSheet(
      getContainer(),
      mockDataCfg,
      null as unknown as S2Options,
    );
    mockInstance.store = new Store();
    mockInstance.dataSet = new PivotDataSet(mockInstance);
    mockInstance.dataSet.setDataCfg(mockDataCfg);
    mockInstance.interaction = new RootInteraction(mockInstance);
    mockInstance.setOptions(mockOptions);

    // 挂载 instance
    cityNode.spreadsheet = mockInstance;
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

  test('for buildDrillDownOptions function', () => {
    const mergedOptions = buildDrillDownOptions(
      mockInstance.options,
      mockPartDrillDown,
      iconClickCallback,
    );
    expect(mergedOptions.headerActionIcons).not.toBeEmpty();
  });

  test('for handleActionIconClick function', async () => {
    handleActionIconClick({
      meta: cityNode,
      callback: iconClickCallback,
    });
    await sleep(1000);
    expect(mockInstance.store.get('drillDownNode')?.id).toEqual(
      'root[&]浙江省[&]杭州市',
    );
  });

  test('for getDrillDownCache function', () => {
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

  test('should order drill down items by drillConfig.fetchData', async () => {
    // 测试第二次下钻的数据，按照第一次下钻的顺序排序的问题。 https://github.com/antvis/S2/pull/1353
    // 准备数据
    const mockFetchData = () =>
      new Promise<PartDrillDownInfo>((resolve) => {
        resolve({
          drillField: 'district',
          drillData: HZDrillDownData,
        });
      });

    mockInstance.store.set('drillDownNode', cityNode);
    const drillDownCfg = {
      rows: mockDataCfg.fields.rows,
      drillFields: ['district'],
      fetchData: mockFetchData,
      spreadsheet: mockInstance,
    };

    // 执行测试
    handleDrillDown(drillDownCfg);
    await sleep(1000);
    const rowLeftNodes = mockInstance.facet.layoutResult.rowLeafNodes;

    expect(rowLeftNodes).toHaveLength(13);
    expect(rowLeftNodes[1].label).toEqual('杭州市');
    expect(rowLeftNodes[2].label).toEqual('西湖区');
    expect(rowLeftNodes[3].label).toEqual('下沙区');
    expect(rowLeftNodes[4].label).toEqual('余杭区');

    // 准备数据
    const SXCityNode = new Node({
      id: `root[&]浙江省[&]绍兴市`,
      key: '',
      value: '',
      field: 'city',
      parent: provinceNode,
    });
    mockInstance.store.set('drillDownNode', SXCityNode);
    drillDownCfg.fetchData = () =>
      new Promise<PartDrillDownInfo>((resolve) => {
        resolve({
          drillField: 'district',
          drillData: SXDrillDownData,
        });
      });

    // 执行操作
    handleDrillDown(drillDownCfg);
    await sleep(1000);
    const secondDrillDownRowLeftNodes =
      mockInstance.facet.layoutResult.rowLeafNodes;

    expect(secondDrillDownRowLeftNodes).toHaveLength(16);
    expect(secondDrillDownRowLeftNodes[5].label).toEqual('绍兴市');
    expect(secondDrillDownRowLeftNodes[6].label).toEqual('下沙区');
    expect(secondDrillDownRowLeftNodes[7].label).toEqual('余杭区');
    expect(secondDrillDownRowLeftNodes[8].label).toEqual('西湖区');
  });
});
