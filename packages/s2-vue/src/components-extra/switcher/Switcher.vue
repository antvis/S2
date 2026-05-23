<script setup lang="ts">
import { SwapOutlined } from '@ant-design/icons-vue';
import { i18n } from '@antv/s2';
import { Button, Popover } from 'ant-design-vue';
import { computed, h, ref } from 'vue';
import SwitcherContent from './SwitcherContent.vue';
import type { SwitcherProps, SwitcherResult } from './interface';
import { getSwitcherClassName } from './util';

const props = withDefaults(defineProps<SwitcherProps>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: 'submit', result: SwitcherResult): void;
}>();

const visible = ref(false);

const onToggleVisible = (open?: boolean) => {
  if (typeof open === 'boolean') {
    visible.value = open;
  } else {
    visible.value = !visible.value;
  }
};

const onSubmit = (result: SwitcherResult) => {
  emit('submit', result);
};

const overlayClassName = computed(() => {
  return (
    props.popover?.overlayClassName
      ? [
          getSwitcherClassName('switcher-overlay'),
          props.popover.overlayClassName,
        ]
      : [getSwitcherClassName('switcher-overlay')]
  ).join(' ');
});

const defaultTitle = computed(() => props.title || i18n('行列切换'));

// Helper to render icon
const renderIcon = () => {
  if (props.icon) {
    return props.icon;
  }

  // Rotate SwapOutlined 90 deg
  return h(SwapOutlined, { rotate: 90 });
};
</script>

<template>
  <Popover
    :open="!disabled && visible"
    trigger="click"
    placement="bottomLeft"
    :destroyTooltipOnHide="true"
    :overlayClassName="overlayClassName"
    v-bind="popover"
    @openChange="onToggleVisible"
  >
    <template #content>
      <SwitcherContent
        v-bind="props"
        @toggle-visible="() => onToggleVisible(false)"
        @submit="onSubmit"
      />
    </template>

    <slot>
      <Button
        :class="getSwitcherClassName('entry-button')"
        size="small"
        :disabled="disabled"
      >
        <template #icon>
          <component :is="renderIcon()" />
        </template>
        {{ defaultTitle }}
      </Button>
    </slot>
  </Popover>
</template>

<style lang="less">
@import './index.less';
</style>
