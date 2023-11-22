/**
 * drill-down.ts 文件已迁移至 shared 文件，但因 spec 中需要的相关方法和数据很多都是在 react 共用的。所以暂不迁移
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
  type DrillDownParams,
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

  const root = new Node({ id: `root`, field: '', value: '', children: [] });
  const provinceNode = new Node({
    id: `root[&]浙江省`,
    value: '',
    field: 'province',
    parent: root,
  });
  const cityNode = new Node({
    id: `root[&]浙江省[&]杭州市`,
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

  test('should set correct drilldownNum', () => {
    const getDrillDownParams = (drillItemsNum?: number) =>
      ({
        rows: mockDataCfg.fields.rows,
        drillFields: ['district'],
        fetchData,
        spreadsheet: mockInstance,
        drillItemsNum,
      }) as DrillDownParams;

    // drillDownNum = undefined
    handleDrillDown(getDrillDownParams());
    expect(mockInstance.store.get('drillItemsNum')).toEqual(-1);

    // reset
    mockInstance.store.get('drillItemsNum', undefined);

    // drillDownNum = integer
    handleDrillDown(getDrillDownParams(19));
    expect(mockInstance.store.get('drillItemsNum')).toEqual(19);
  });

  test('for handleDrillDown function', async () => {
    mockInstance.store.set('drillDownNode', cityNode);
    const drillDownCfg: DrillDownParams = {
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
    /*
     * 测试第二次下钻的数据，按照第一次下钻的顺序排序的问题。 https://github.com/antvis/S2/pull/1353
     * 准备数据
     */
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
    const rowLeafNodes = mockInstance.facet.getRowLeafNodes();

    expect(rowLeafNodes).toHaveLength(13);
    expect(rowLeafNodes[1].value).toEqual('杭州市');
    expect(rowLeafNodes[2].value).toEqual('西湖区');
    expect(rowLeafNodes[3].value).toEqual('下沙区');
    expect(rowLeafNodes[4].value).toEqual('余杭区');

    // 准备数据
    const SXCityNode = new Node({
      id: `root[&]浙江省[&]绍兴市`,
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
    const secondDrillDownRowLeftNodes = mockInstance.facet.getRowLeafNodes();

    expect(secondDrillDownRowLeftNodes).toHaveLength(16);
    expect(secondDrillDownRowLeftNodes[5].value).toEqual('绍兴市');
    expect(secondDrillDownRowLeftNodes[6].value).toEqual('下沙区');
    expect(secondDrillDownRowLeftNodes[7].value).toEqual('余杭区');
    expect(secondDrillDownRowLeftNodes[8].value).toEqual('西湖区');
  });
});
