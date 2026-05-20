<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '../../src';

function generateRawData(
  row: Record<string, number>,
  col: Record<string, number>,
) {
  const res: Record<string, any>[] = [];
  const rowKeys = Object.keys(row);
  const colKeys = Object.keys(col);

  for (let i = 0; i < row[rowKeys[0]]; i++) {
    for (let j = 0; j < row[rowKeys[1]]; j++) {
      for (let m = 0; m < col[colKeys[0]]; m++) {
        for (let n = 0; n < col[colKeys[1]]; n++) {
          res.push({
            province: `p${i}`,
            city: `c${j}`,
            type: `type${m}`,
            subType: `subType${n}`,
            number: i * n,
          });
        }
      }
    }
  }

  return res;
}

const loading = ref(true);

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: ['type', 'subType'],
    columns: ['province', 'city'],
    values: ['number'],
  },
  data: [],
});

const options = ref<S2Options>({
  width: 1200,
  height: 480,
  interaction: {
    scrollSpeedRatio: { vertical: 1, horizontal: 1 },
  },
  showDefaultHeaderActionIcon: false,
  future: { experimentalReuseCell: true },
});

onMounted(() => {
  // Generate 1 million data points asynchronously
  setTimeout(() => {
    dataCfg.value = {
      ...dataCfg.value,
      data: generateRawData(
        { province: 10, city: 100 },
        { type: 10, subType: 100 },
      ),
    };
    loading.value = false;
  }, 100);
});
</script>

<template>
  <div>
    <h3>100万数据 (Big Data Sheet)</h3>
    <p>测试大数据量渲染性能 (10 * 100 * 10 * 100 = 1,000,000 条数据)</p>
    <div v-if="loading" style="padding: 20px">正在生成数据...</div>
    <SheetComponent
      v-else
      sheetType="pivot"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
