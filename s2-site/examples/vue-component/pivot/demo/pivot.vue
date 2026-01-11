<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SheetComponent } from '@antv/s2-vue';
import '@antv/s2-vue/dist/s2-vue.min.css';

const dataCfg = ref(null);
const options = {
  width: 600,
  height: 480,
  hierarchyType: 'grid',
  cornerExtraFieldText: '自定义',
  interaction: {
    copy: {
      enable: true,
      withFormat: true,
      withHeader: true,
    },
  },
};
const sheetType = 'pivot';

const s2DataConfig = {
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
      field: 'sub_type',
      name: '子类别',
    },
    {
      field: 'number',
      name: '数量',
    },
  ],
};

onMounted(() => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json')
    .then(res => res.json())
    .then(data => {
      dataCfg.value = {
          ...data,
          ...s2DataConfig
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
