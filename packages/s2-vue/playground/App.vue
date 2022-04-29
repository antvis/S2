<script lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { defineComponent, ref } from 'vue';
import { BaseSheet } from '../src';

const dataCfg: S2DataConfig = {
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
const options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  hierarchyCollapse: false,
};

const onRowCellClick = (params: any) => {
  // eslint-disable-next-line no-console
  console.log('row cell click: ', params);
};

const onGetSpreadsheet = (params: any) => {
  // eslint-disable-next-line no-console
  console.log('getSpreadsheet: ', params);
};

export default defineComponent({
  setup() {
    const s2 = ref();

    return { s2, dataCfg, options, onRowCellClick, onGetSpreadsheet };
  },
  components: {
    BaseSheet,
  },
});
</script>

<template>
  <BaseSheet
    ref="s2"
    :dataCfg="dataCfg"
    :options="options"
    @rowCellClick="onRowCellClick"
    @getSpreadSheet="onGetSpreadsheet"
  />
</template>

<style lang="less">
@import 'ant-design-vue/dist/antd.compact.less';
</style>
