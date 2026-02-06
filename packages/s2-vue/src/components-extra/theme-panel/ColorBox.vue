<script setup lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { computed } from 'vue';

const PRE_CLASS = `${S2_PREFIX_CLS}-color-box`;

const props = withDefaults(
  defineProps<{
    color: string;
    class?: string;
  }>(),
  {
    class: '',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classNames = computed(() => {
  return [PRE_CLASS, props.class].filter(Boolean).join(' ');
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <div
    :class="classNames"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  />
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-color-box {
  display: inline-flex;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
