<script setup lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { Tooltip } from 'ant-design-vue';
import { computed } from 'vue';

const PRE_CLASS = `${S2_PREFIX_CLS}-tooltip-wrapper`;

const props = withDefaults(
  defineProps<{
    title?: string;
    class?: string;
  }>(),
  {
    title: '',
    class: '',
  },
);

const classNames = computed(() => {
  return [PRE_CLASS, props.class].filter(Boolean).join(' ');
});
</script>

<template>
  <Tooltip :title="title" :class="classNames">
    <slot />
  </Tooltip>
</template>
