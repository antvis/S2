<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options, HierarchyType } from '@antv/s2';
import { SheetComponent } from '../../src';

const hierarchyType = ref<HierarchyType>('tree');

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: [],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
    customTreeItems: [
      {
        key: 'a-1',
        title: '自定义节点A',
        children: [
          { key: 'measure-a', title: '指标A' },
          { key: 'measure-b', title: '指标B' },
        ],
      },
      {
        key: 'a-2',
        title: '自定义节点B',
        children: [
          { key: 'measure-c', title: '指标C' },
          { key: 'measure-d', title: '指标D' },
        ],
      },
    ],
  },
  meta: [
    { field: 'type', name: '类别' },
    { field: 'sub_type', name: '子类别' },
    { field: 'number', name: '数量' },
  ],
  data: [
    {
      'measure-a': 1000,
      'measure-b': 2000,
      'measure-c': 3000,
      'measure-d': 4000,
      type: '家具',
      sub_type: '桌子',
    },
    {
      'measure-a': 1500,
      'measure-b': 2500,
      'measure-c': 3500,
      'measure-d': 4500,
      type: '家具',
      sub_type: '沙发',
    },
    {
      'measure-a': 800,
      'measure-b': 1800,
      'measure-c': 2800,
      'measure-d': 3800,
      type: '办公用品',
      sub_type: '笔',
    },
    {
      'measure-a': 1200,
      'measure-b': 2200,
      'measure-c': 3200,
      'measure-d': 4200,
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
});

const options = ref<S2Options>({
  width: 800,
  height: 480,
  showDefaultHeaderActionIcon: false,
  interaction: {
    copy: { enable: true, withHeader: true, withFormat: true },
  },
});

const toggleHierarchy = () => {
  hierarchyType.value = hierarchyType.value === 'tree' ? 'grid' : 'tree';
};
</script>

<template>
  <div>
    <h3>自定义目录树 (Custom Tree)</h3>
    <p>支持自定义行头目录树结构</p>
    <div style="margin-bottom: 10px">
      <button @click="toggleHierarchy">
        切换为{{ hierarchyType === 'tree' ? '平铺' : '树状' }}模式
      </button>
    </div>
    <SheetComponent
      sheetType="pivot"
      :dataCfg="dataCfg"
      :options="{ ...options, hierarchyType }"
      :adaptive="true"
    />
  </div>
</template>
