<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { isUpDataValue } from '@antv/s2';
import { isNil } from 'lodash';
import { SheetComponent } from '../../src';

const showConditions = ref(true);

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['number'],
    customTreeItems: [
      {
        key: 'province',
        title: '省份',
        children: [{ key: 'city', title: '城市' }],
      },
    ],
  },
  meta: [
    { field: 'number', name: '数量' },
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '类别' },
  ],
  data: [
    {
      number: { values: [[7789, '+0.5%', '+200']] },
      province: '浙江省',
      city: '杭州市',
      type: '家具',
    },
    {
      number: { values: [[2367, '-1.2%', '-100']] },
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
    },
    {
      number: { values: [[3877, '+2.3%', '+300']] },
      province: '浙江省',
      city: '宁波市',
      type: '家具',
    },
    {
      number: { values: [[945, '-0.8%', '-50']] },
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
    },
    {
      number: { values: [[1304, '+1.5%', '+80']] },
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
    },
    {
      number: { values: [[1145, '+0.9%', '+60']] },
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
    },
  ],
});

const getConditions = () => ({
  text: [
    {
      mapping: (value: string | number, cellInfo: { colIndex?: number }) => {
        const { colIndex } = cellInfo;
        const isNilValue = isNil(value) || value === '';

        if (colIndex === 0 || isNilValue) {
          return { fill: '#000', fontSize: 16, opacity: 0.7 };
        }

        return {
          fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          fontSize: 16,
          opacity: 0.7,
        };
      },
    },
  ],
  icon: [
    {
      position: 'left' as const,
      mapping(value: string | number, cellInfo: { colIndex?: number }) {
        const { colIndex } = cellInfo;

        if (colIndex === 0) {
          return null;
        }

        return isUpDataValue(value)
          ? { icon: 'CellUp', fill: '#FF4D4F', size: 12 }
          : { icon: 'CellDown', fill: '#29A294', size: 12 };
      },
    },
  ],
});

const options = ref<S2Options>({
  width: 1200,
  height: 500,
  hierarchyType: 'tree',
});
</script>

<template>
  <div>
    <h3>趋势分析表 (Strategy Sheet)</h3>
    <p>用于展示趋势分析数据，支持多指标和条件格式</p>
    <div style="margin-bottom: 10px">
      <button @click="showConditions = !showConditions">
        {{ showConditions ? '关闭字段标记' : '开启字段标记' }}
      </button>
    </div>
    <SheetComponent
      sheetType="strategy"
      :dataCfg="dataCfg"
      :options="{
        ...options,
        conditions: showConditions ? getConditions() : null,
      }"
      :adaptive="true"
    />
  </div>
</template>
