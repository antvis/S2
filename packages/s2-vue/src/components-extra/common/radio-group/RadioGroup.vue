<script setup lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { RadioGroup as ARadioGroup } from 'ant-design-vue';
import { computed } from 'vue';
import type { RadioGroupProps as AntdRadioGroupProps } from 'ant-design-vue';

const PRE_CLASS = `${S2_PREFIX_CLS}-radio-group`;

const props = withDefaults(
  defineProps<{
    label?: string;
    onlyIcon?: boolean;
    options?: AntdRadioGroupProps['options'];
    value?: string | number | boolean;
    optionType?: 'default' | 'button';
    size?: 'large' | 'default' | 'small';
  }>(),
  {
    label: '',
    onlyIcon: false,
    optionType: 'default',
    size: 'small',
  },
);

const emit = defineEmits<{
  change: [event: any];
}>();

const classNames = computed(() => {
  return {
    [PRE_CLASS]: true,
    [`${PRE_CLASS}-icon-only`]: props.onlyIcon,
  };
});

const handleChange = (e: any) => {
  const value = e?.target?.value ?? e;

  emit('change', { target: { value } });
};
</script>

<template>
  <div :class="classNames">
    <span :class="`${PRE_CLASS}-label`">{{ label }}</span>
    <span :class="`${PRE_CLASS}-content`">
      <ARadioGroup
        :size="size"
        :value="value"
        :options="options"
        :option-type="optionType"
        @change="handleChange"
        @update:value="handleChange"
      />
      <slot name="extra" />
    </span>
  </div>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-radio-group {
  color: #3572f9;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &.@{s2-cls-prefix}-radio-group-icon-only {
    .ant-radio-group {
      .ant-radio-button-wrapper {
        border: none;
        background: transparent;
        box-shadow: none;

        &::before {
          display: none;
        }

        &-checked {
          background: transparent;
          border: none;
          box-shadow: none;
          outline: none;

          &:focus-visible,
          &:focus-within {
            border: none;
            outline: none;
          }
        }
      }
    }
  }

  & + .@{s2-cls-prefix}-radio-group {
    margin-top: 6px;
  }

  &-label {
    flex: 1 0;
    flex-wrap: nowrap;
    display: inline-flex;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-right: 12px;
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
