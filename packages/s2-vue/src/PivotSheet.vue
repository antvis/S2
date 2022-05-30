<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PivotSheet } from '@antv/s2';
import type { S2DataConfig, S2Options } from '@antv/s2';

const props = defineProps<{
  dataCfg: S2DataConfig;
  options: S2Options;
}>();

const container = ref<HTMLDivElement>();

onMounted(() => {
  const sheet = new PivotSheet(container.value!, props.dataCfg, props.options);
  sheet.render();
});
</script>

<template>
  <div>
    <div class="container" ref="container" />
  </div>
</template>

<style lang="less">
.container {
  border: 1px solid gray;
}
</style>
