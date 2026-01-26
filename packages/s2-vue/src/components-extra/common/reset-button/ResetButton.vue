<script setup lang="ts">
import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { ReloadOutlined } from '@ant-design/icons-vue';

const PRE_CLASS = `${S2_PREFIX_CLS}-reset-btn`;

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: () => i18n('重置'),
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <span :class="PRE_CLASS" @click="handleClick">
    <ReloadOutlined :class="`${PRE_CLASS}-icon`" />
    <span :class="`${PRE_CLASS}-text`">{{ title }}</span>
  </span>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-reset-btn {
  color: #3572f9;
  cursor: pointer;
  padding-left: 8px;

  &-text {
    margin-left: 4px;
  }
}
</style>
