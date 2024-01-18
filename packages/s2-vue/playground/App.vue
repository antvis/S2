<script lang="ts">
/* eslint-disable no-console */
import { CellType, RawData, type S2DataConfig, type S2Options } from '@antv/s2';
import type {
  PartDrillDown,
  PartDrillDownInfo,
  SheetType,
} from '@antv/s2-shared';
import { forEach, random } from 'lodash';
import { defineComponent, reactive, ref, shallowRef } from 'vue';
import { SheetComponent } from '../src';

const dataConfig1: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'number',
      name: '数量',
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
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

const dataConfig2: S2DataConfig = {
  fields: {
    rows: ['province', 'city', 'type'],
    columns: ['sub_type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'number',
      name: '数量',
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
  ],
  data: [
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
      {
        name: '销售渠道',
        value: 'channel',
        type: 'text',
      },
      {
        name: '客户性别',
        value: 'sex',
        type: 'text',
      },
    ],
  },
  // drillItemsNum: 1,
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      // 弹窗 -> 选择 -> 请求数据
      const dataSet = meta.spreadsheet.dataSet;
      const field = drillFields[0];
      const rowData = dataSet
        .getCellMultiData({ query: meta.query! })
        .filter((item) => item?.['sub_type'] && item?.['type']) as RawData[];

      console.log(rowData);
      const drillDownData: RawData[] = [];

      forEach(rowData, (data) => {
        const { number, sub_type: subType, type } = data;
        const number0 = random(50, number as number);
        const number1 = Number(number!) - number0;
        const dataItem0 = {
          ...meta.query,
          number: number0,
          sub_type: subType,
          type,
          [field]: fieldMap[field as keyof typeof fieldMap][0],
        };

        drillDownData.push(dataItem0);
        const dataItem1 = {
          ...meta.query,
          number: number1,
          sub_type: subType,
          type,
          [field]: fieldMap[field as keyof typeof fieldMap][1],
        };

        drillDownData.push(dataItem1);
      });
      console.log(drillDownData);
      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    }),
};

export default defineComponent({
  setup() {
    const sheetType = ref<SheetType>('pivot');
    const s2 = shallowRef();
    const dataCfgFlag = ref(1);

    /*
     * ! !! 千万不要写成 reactive<S2Options> 这种形式, vue 内部会将 T 进一步进行 unref 拆解，S2Options默认T包含Element, 一旦有了这个类型，解析出来的类型非常的复杂，而且会出错
     *   reference: ../S2/node_modules/@vue/runtime-core/node_modules/@vue/reactivity/dist/reactivity.d.ts L321
     */
    const options = reactive({
      debug: true,
      width: 600,
      height: 400,
      style: {
        rowCell: {
          collapseAll: false,
        },
      },
      tooltip: {
        operation: {
          hiddenColumns: true,
          sort: true,
          menu: {
            onClick: (info, cell) => {
              console.log('menuClick', info, cell);
            },
            items: [
              {
                key: 'trend',
                icon: 'Trend',
                label: '趋势',
                visible: (cell) => cell.cellType === CellType.DATA_CELL,
                onClick(info, cell) {
                  // eslint-disable-next-line no-console
                  console.log('趋势图 icon 点击: ', info, cell);
                },
              },
              {
                key: '1',
                icon: 'Trend',
                label: '菜单1',
                onClick(info, cell) {
                  console.log('cell-1: ', cell);
                },
                children: [
                  {
                    key: '1-1',
                    icon: 'Trend',
                    label: '菜单1-1',
                    onClick(info, cell) {
                      console.log('cell-1-1: ', cell);
                    },
                  },
                ],
              },
              {
                key: '2',
                icon: 'Trend',
                label: '菜单2',
                onClick(info, cell) {
                  console.log('cell-2: ', cell);
                },
              },
            ],
          },
        },
      },
    }) as unknown as S2Options;

    const themeCfg = reactive({
      theme: {
        cornerCell: {
          text: {
            fill: 'red',
          },
        },
      },
    });

    const onRowCellClick = (params: any) => {
      console.log('row cell click: ', params);
    };
    const onDataCellClick = (params: any) => {
      console.log('data Cell Click: ', params);
    };
    const onColCellClick = (params: any) => {
      console.log('col cell click: ', params);
    };
    const onMounted = (params: any) => {
      console.log('onMounted: ', params);
    };

    const handlePageChange = (current: number) =>
      console.log('page changed:', current);

    const handlePageSizeChange = (pageSize: number) =>
      console.log('pageSize changed:', pageSize);

    const togglePagination = () => {
      options.pagination = options.pagination
        ? undefined
        : { current: 1, pageSize: 4 };
    };

    onMounted(() => {
      console.log('onMounted', s2.value?.instance);
    });

    return {
      sheetType,
      s2,
      dataCfgFlag,
      dataConfig1,
      dataConfig2,
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
    };
  },
  components: {
    SheetComponent,
  },
});
</script>

<template>
  <div style="margin-bottom: 10px">
    <button @click="togglePagination">toggle pagination</button>
    <button @click="dataCfgFlag = dataCfgFlag === 1 ? 2 : 1">
      更新dataCfg
    </button>
    <button
      @click="
        options.hierarchyType =
          options.hierarchyType === 'tree' ? 'grid' : 'tree'
      "
    >
      更新options
    </button>

    <button
      @click="
        themeCfg.theme.cornerCell.text.fill =
          themeCfg.theme.cornerCell.text.fill === 'blue' ? 'red' : 'blue'
      "
    >
      更新到themeCfg
    </button>
    <div>
      <label>
        <input type="radio" id="pivot" value="pivot" v-model="sheetType" />
        透视表
      </label>
      <label>
        <input type="radio" id="table" value="table" v-model="sheetType" />
        明细表
      </label>
    </div>
  </div>
  <SheetComponent
    ref="s2"
    :sheetType="sheetType"
    :dataCfg="dataCfgFlag === 1 ? dataConfig1 : dataConfig2"
    :options="options"
    :themeCfg="themeCfg"
    :adaptive="true"
    :showPagination="showPagination"
    :partDrillDown="partDrillDown"
    @rowCellClick="onRowCellClick"
    @mounted="onMounted"
    @dataCellClick="onDataCellClick"
    @colCellClick="onColCellClick"
  />
</template>

<style lang="less">
@import 'ant-design-vue/dist/antd.less';
</style>
