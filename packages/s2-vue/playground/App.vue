<script lang="ts">
/* eslint-disable no-console */
import {
  CellType,
  type RawData,
  type S2DataConfig,
  type S2Options,
  type PartDrillDown,
  type PartDrillDownInfo,
  type SheetType,
} from '@antv/s2';
import { Tabs, TabPane } from 'ant-design-vue';
import { forEach, random } from 'lodash';
import { defineComponent, reactive, ref, shallowRef } from 'vue';
import { SheetComponent } from '../src';

// Import playground components
import ChartSheetDemo from './components/ChartSheet.vue';
import GridAnalysisSheetDemo from './components/GridAnalysisSheet.vue';
import StrategySheetDemo from './components/StrategySheet.vue';
import PivotChartSheetDemo from './components/PivotChartSheet.vue';
import CustomTreeDemo from './components/CustomTree.vue';
import CustomGridDemo from './components/CustomGrid.vue';
import BigDataSheetDemo from './components/BigDataSheet.vue';
import PluginsSheetDemo from './components/PluginsSheet.vue';

const dataConfig1: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    { field: 'number', name: '数量' },
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '类别' },
    { field: 'sub_type', name: '子类别' },
  ],
  data: [
    {
      number: 7789,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2367,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 3877,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 4342,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 5343,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 632,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 7234,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 834,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 945,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1304,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1145,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1432,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1354,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1634,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1723,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1822,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1943,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2330,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2451,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2244,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2333,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2445,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2335,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 245,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2457,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2458,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 4004,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3077,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3551,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 352,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
};

const fieldMap = {
  channel: ['物美', '华联'],
  sex: ['男', '女'],
};

const partDrillDown: PartDrillDown = {
  drillConfig: {
    dataSet: [
      { name: '客户性别', value: 'sex2', type: 'location' },
      { name: '销售渠道', value: 'channel', type: 'text' },
      { name: '客户性别111', value: 'sex1', type: 'date' },
    ],
  },
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      const dataSet = meta.spreadsheet.dataSet;
      const field = drillFields[0];
      const rowData = dataSet
        .getCellMultiData({ query: meta.query! })
        .filter((item) => item?.['sub_type'] && item?.['type']) as RawData[];

      const drillDownData: RawData[] = [];

      forEach(rowData, (data) => {
        const { number, sub_type: subType, type } = data;
        const number0 = random(50, number as number);
        const number1 = Number(number!) - number0;

        drillDownData.push({
          ...meta.query,
          number: number0,
          sub_type: subType,
          type,
          [field]: fieldMap[field as keyof typeof fieldMap][0],
        });
        drillDownData.push({
          ...meta.query,
          number: number1,
          sub_type: subType,
          type,
          [field]: fieldMap[field as keyof typeof fieldMap][1],
        });
      });

      resolve({ drillField: field, drillData: drillDownData });
    }),
};

export default defineComponent({
  setup() {
    const activeTab = ref('basic');
    const sheetType = ref<SheetType>('pivot');
    const s2 = shallowRef();
    const loading = ref(false);

    const options = reactive({
      debug: true,
      width: 600,
      height: 400,
      style: { rowCell: { collapseAll: false } },
      tooltip: {
        operation: {
          hiddenColumns: true,
          sort: true,
          menu: {
            onClick: (info: any, cell: any) =>
              console.log('menuClick', info, cell),
            items: [
              {
                key: 'trend',
                icon: 'Trend',
                label: '趋势',
                visible: (cell: any) => cell.cellType === CellType.DATA_CELL,
                onClick: (info: any, cell: any) =>
                  console.log('趋势图点击:', info, cell),
              },
            ],
          },
        },
      },
    }) as unknown as S2Options;

    const themeCfg = reactive({
      theme: { cornerCell: { text: { fill: 'red' } } },
    });

    const onRowCellClick = (params: any) =>
      console.log('row cell click:', params);
    const onDataCellClick = (params: any) =>
      console.log('data cell click:', params);
    const onColCellClick = (params: any) =>
      console.log('col cell click:', params);
    const onMounted = (params: any) => console.log('onMounted:', params);

    const handlePageChange = (current: number) =>
      console.log('page changed:', current);
    const handlePageSizeChange = (pageSize: number) =>
      console.log('pageSize changed:', pageSize);

    const togglePagination = () => {
      options.pagination = options.pagination
        ? undefined
        : { current: 1, pageSize: 4 };
    };

    return {
      activeTab,
      sheetType,
      s2,
      dataConfig1,
      options,
      themeCfg,
      onRowCellClick,
      onDataCellClick,
      onColCellClick,
      onMounted,
      togglePagination,
      partDrillDown,
      showPagination: {
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
      },
      loading,
    };
  },
  components: {
    SheetComponent,
    Tabs,
    TabPane,
    ChartSheetDemo,
    GridAnalysisSheetDemo,
    StrategySheetDemo,
    PivotChartSheetDemo,
    CustomTreeDemo,
    CustomGridDemo,
    BigDataSheetDemo,
    PluginsSheetDemo,
  },
});
</script>

<template>
  <div class="playground">
    <h1>S2 Vue Playground</h1>
    <Tabs v-model:activeKey="activeTab" type="card" destroyInactiveTabPane>
      <TabPane key="basic" tab="基础表">
        <div style="margin-bottom: 10px">
          <button @click="togglePagination">切换分页</button>
          <button
            @click="
              options.hierarchyType =
                options.hierarchyType === 'tree' ? 'grid' : 'tree'
            "
          >
            切换层级类型
          </button>
          <button
            @click="
              themeCfg.theme.cornerCell.text.fill =
                themeCfg.theme.cornerCell.text.fill === 'blue' ? 'red' : 'blue'
            "
          >
            更新主题
          </button>
          <button @click="loading = !loading">
            {{ loading ? '停止Loading' : '开启Loading' }}
          </button>
          <div style="margin-top: 10px">
            <label
              ><input type="radio" value="pivot" v-model="sheetType" />
              透视表</label
            >
            <label
              ><input type="radio" value="table" v-model="sheetType" />
              明细表</label
            >
            <label
              ><input type="radio" value="editable" v-model="sheetType" />
              编辑表</label
            >
          </div>
        </div>
        <SheetComponent
          ref="s2"
          :sheetType="sheetType"
          :dataCfg="dataConfig1"
          :options="options"
          :themeCfg="themeCfg"
          :adaptive="true"
          :showPagination="showPagination"
          :partDrillDown="partDrillDown"
          :loading="loading"
          @rowCellClick="onRowCellClick"
          @mounted="onMounted"
          @dataCellClick="onDataCellClick"
          @colCellClick="onColCellClick"
        />
      </TabPane>
      <TabPane key="customTree" tab="自定义目录树">
        <CustomTreeDemo />
      </TabPane>
      <TabPane key="customGrid" tab="自定义行列头">
        <CustomGridDemo />
      </TabPane>
      <TabPane key="strategy" tab="趋势分析表">
        <StrategySheetDemo />
      </TabPane>
      <TabPane key="gridAnalysis" tab="网格分析表">
        <GridAnalysisSheetDemo />
      </TabPane>
      <TabPane key="editable" tab="编辑表">
        <SheetComponent
          sheetType="editable"
          :dataCfg="dataConfig1"
          :options="{ ...options, tooltip: { enable: false } }"
          :adaptive="true"
        />
      </TabPane>
      <TabPane key="plugins" tab="AntV/G 插件系统">
        <PluginsSheetDemo />
      </TabPane>
      <TabPane key="pivotChart" tab="透视组合图">
        <PivotChartSheetDemo />
      </TabPane>
      <TabPane key="chart" tab="绘制 G2 图表">
        <ChartSheetDemo />
      </TabPane>
      <TabPane key="bigData" tab="100万数据">
        <BigDataSheetDemo />
      </TabPane>
    </Tabs>
  </div>
</template>

<style lang="less">
@import 'ant-design-vue/dist/antd.less';

.playground {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
  }

  button {
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 4px 12px;
    cursor: pointer;
  }

  label {
    margin-right: 16px;
  }
}
</style>
