<script setup lang="ts">
import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { Checkbox } from 'ant-design-vue';
import type { CheckboxProps } from 'ant-design-vue';

type CheckboxChangeEvent = Parameters<
  NonNullable<CheckboxProps['onChange']>
>[0];
import { isEmpty } from 'lodash';
import { ref, computed } from 'vue';
import { ResetGroup } from '../common';
import FrozenInputNumber from './FrozenInputNumber.vue';
import type { FrozenPanelOptions } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-frozen-panel`;

const props = withDefaults(
  defineProps<{
    title?: string;
    defaultOptions?: Partial<FrozenPanelOptions>;
    defaultCollapsed?: boolean;
    inputNumberProps?: {
      min?: number;
      max?: number;
      step?: number;
      size?: 'large' | 'middle' | 'small';
    };
    showFrozenRowHeader?: boolean;
    showFrozenRow?: boolean;
    showFrozenCol?: boolean;
  }>(),
  {
    title: () => i18n('冻结行列头'),
    defaultCollapsed: false,
    showFrozenRowHeader: true,
    showFrozenRow: true,
    showFrozenCol: true,
  },
);

const emit = defineEmits<{
  change: [options: FrozenPanelOptions];
  reset: [options: FrozenPanelOptions, prevOptions: FrozenPanelOptions];
}>();

const options = ref<FrozenPanelOptions>({
  frozenRow: [],
  frozenCol: [],
  frozenRowHeader: true,
  ...props.defaultOptions,
});

const defaultOptionsRef = ref<FrozenPanelOptions>({ ...options.value });

const onResetClick = () => {
  const prevOptions = { ...options.value };

  options.value = { ...defaultOptionsRef.value };
  emit('reset', defaultOptionsRef.value, prevOptions);
};

const onRowHeaderChange = (event: CheckboxChangeEvent) => {
  options.value = {
    ...options.value,
    frozenRowHeader: event.target.checked,
  };
  emit('change', options.value);
};

const BASE_FROZEN_CONFIG = computed(() => {
  return [
    {
      suffix: i18n('行'),
      field: 'frozenRow' as const,
      visible: props.showFrozenRow,
    },
    {
      suffix: i18n('列'),
      field: 'frozenCol' as const,
      visible: props.showFrozenCol,
    },
  ].filter(({ visible }) => visible);
});

const isFieldEnabled = (field: 'frozenRow' | 'frozenCol') => {
  return !isEmpty(options.value[field]);
};

const getLeadingCount = (field: 'frozenRow' | 'frozenCol') => {
  return options.value[field]?.[0];
};

const getTrailingCount = (field: 'frozenRow' | 'frozenCol') => {
  return options.value[field]?.[1];
};

const onGroupChange = (
  field: 'frozenRow' | 'frozenCol',
  value: [number?, number?],
) => {
  options.value = {
    ...options.value,
    [field]: value,
  };
  emit('change', options.value);
};

const onCheckboxChange = (
  field: 'frozenRow' | 'frozenCol',
  checked: boolean,
) => {
  onGroupChange(field, checked ? [1, 1] : []);
};

const onLeadingChange = (
  field: 'frozenRow' | 'frozenCol',
  val: number | null,
) => {
  onGroupChange(field, [val ?? undefined, getTrailingCount(field)]);
};

const onTrailingChange = (
  field: 'frozenRow' | 'frozenCol',
  val: number | null,
) => {
  onGroupChange(field, [getLeadingCount(field), val ?? undefined]);
};
</script>

<template>
  <ResetGroup
    :title="title"
    :defaultCollapsed="defaultCollapsed"
    :class="PRE_CLASS"
    @reset="onResetClick"
  >
    <div v-if="showFrozenRowHeader" :class="`${PRE_CLASS}-container`">
      <Checkbox :checked="options.frozenRowHeader" @change="onRowHeaderChange">
        {{ i18n('冻结行头') }}
      </Checkbox>
    </div>
    <div
      v-for="config in BASE_FROZEN_CONFIG"
      :key="config.field"
      :class="`${PRE_CLASS}-container`"
    >
      <Checkbox
        :checked="isFieldEnabled(config.field)"
        @change="
          (e: CheckboxChangeEvent) =>
            onCheckboxChange(config.field, e.target.checked!)
        "
      >
        {{ i18n('冻结') }}{{ config.suffix }}
      </Checkbox>
      <span :class="`${PRE_CLASS}-container-group`">
        {{ i18n('冻结前') }}
        <FrozenInputNumber
          :disabled="!isFieldEnabled(config.field)"
          :value="getLeadingCount(config.field) ?? null"
          v-bind="inputNumberProps"
          @change="(val: number | null) => onLeadingChange(config.field, val)"
        />
        {{ config.suffix }}
      </span>
      <span :class="`${PRE_CLASS}-container-group`">
        {{ i18n('冻结后') }}
        <FrozenInputNumber
          :disabled="!isFieldEnabled(config.field)"
          :value="getTrailingCount(config.field) ?? null"
          v-bind="inputNumberProps"
          @change="(val: number | null) => onTrailingChange(config.field, val)"
        />
        {{ config.suffix }}
      </span>
    </div>
    <slot />
  </ResetGroup>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-frozen-panel {
  width: 400px;

  &-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-of-type) {
      margin-bottom: 6px;
    }

    &-group {
      color: rgba(0, 0, 0, 0.43);

      &:not(:last-of-type) {
        margin-right: 12px;
      }
    }

    .ant-checkbox-wrapper {
      margin-right: 50px;
      color: #535455;
    }

    .ant-input-number.@{s2-cls-prefix}-frozen-input-number {
      width: 50px;
      margin: 0 4px;
      border-radius: 4px;
    }
  }
}
</style>
