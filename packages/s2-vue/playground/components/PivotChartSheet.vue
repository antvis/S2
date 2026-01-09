<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '../../src';

const dataCfg = ref<S2DataConfig>({
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
  ],
});

const options = ref<S2Options>({
  width: 1200,
  height: 600,
  interaction: {
    brushSelection: { rowCell: false, colCell: false, dataCell: false },
    hoverFocus: false,
  },
});
</script>

<template>
  <div>
    <h3>透视组合图 (Pivot Chart Sheet)</h3>
    <p>透视表与图表结合的展示形式</p>
    <SheetComponent
      sheetType="pivotChart"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
