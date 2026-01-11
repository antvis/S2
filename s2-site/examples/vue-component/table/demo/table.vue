<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SheetComponent } from '@antv/s2-vue';
import '@antv/s2-vue/dist/s2-vue.min.css';

const dataCfg = ref(null);
const options = {
  width: 600,
  height: 480,
  seriesNumber: {
    enable: true,
    text: '序号',
  },
  placeholder: {
    cell: '-',
    empty: {
      icon: 'Empty',
      description: '暂无数据',
    },
  },
};
const sheetType = 'table';

const s2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price', 'cost'],
  },
  meta: [
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
      name: '商品类别',
    },
    {
      field: 'price',
      name: '价格',
    },
    {
      field: 'cost',
      name: '成本',
    },
  ],
};

onMounted(() => {
  fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
    .then(res => res.json())
    .then(data => {
      dataCfg.value = {
          ...s2DataConfig,
          data
      };
    });
});
</script>

<template>
  <SheetComponent
    v-if="dataCfg"
    :sheetType="sheetType"
    :dataCfg="dataCfg"
    :options="options"
  />
</template>
