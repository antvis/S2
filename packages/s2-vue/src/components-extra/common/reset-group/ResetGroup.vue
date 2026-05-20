<script setup lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { Collapse, CollapsePanel } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { ResetButton } from '../reset-button';

const ACTIVE_KEY = 'RESET_GROUP';
const PRE_CLASS = `${S2_PREFIX_CLS}-reset-group`;

const props = withDefaults(
  defineProps<{
    title?: string;
    defaultCollapsed?: boolean;
    class?: string;
  }>(),
  {
    title: '',
    defaultCollapsed: false,
    class: '',
  },
);

const emit = defineEmits<{
  reset: [];
}>();

const activeKey = ref(props.defaultCollapsed ? [] : [ACTIVE_KEY]);

const classNames = computed(() => {
  return [PRE_CLASS, props.class].filter(Boolean).join(' ');
});

const handleResetClick = (e: MouseEvent) => {
  e.stopPropagation();
  emit('reset');
};
</script>

<template>
  <Collapse v-model:activeKey="activeKey" :bordered="false" :class="classNames">
    <template #expandIcon="{ isActive }">
      <CaretRightOutlined :rotate="isActive ? 90 : 0" />
    </template>
    <CollapsePanel
      :key="ACTIVE_KEY"
      :header="title"
      :class="`${PRE_CLASS}-panel`"
    >
      <template #extra>
        <ResetButton @click="handleResetClick" />
      </template>
      <slot />
    </CollapsePanel>
  </Collapse>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-reset-group {
  width: 340px;
}
</style>
