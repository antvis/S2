<script setup lang="ts">
import { S2_PREFIX_CLS, i18n, type TextAlign, type S2Theme } from '@antv/s2';
import { h, ref, watch } from 'vue';
import { RadioGroup, ResetGroup, TooltipWrapper } from '../common';
import { LeftAlignIcon, CenterAlignIcon, RightAlignIcon } from './icons';
import {
  generateCellTextAlignTheme,
  type TextAlignPanelOptions,
} from './utils';

const PRE_CLASS = `${S2_PREFIX_CLS}-text-align-panel`;

const props = withDefaults(
  defineProps<{
    title?: string;
    defaultOptions?: Partial<TextAlignPanelOptions>;
    defaultCollapsed?: boolean;
  }>(),
  {
    title: () => i18n('文字对齐'),
    defaultCollapsed: false,
  },
);

const emit = defineEmits<{
  change: [options: TextAlignPanelOptions, theme: S2Theme];
  reset: [
    options: TextAlignPanelOptions,
    prevOptions: TextAlignPanelOptions,
    theme: S2Theme,
  ];
}>();

const options = ref<TextAlignPanelOptions>({
  rowCellTextAlign: 'left',
  dataCellTextAlign: 'right',
  ...props.defaultOptions,
});

const defaultOptionsRef = ref<TextAlignPanelOptions>({ ...options.value });

const onResetClick = () => {
  const theme = generateCellTextAlignTheme(defaultOptionsRef.value);
  const prevOptions = { ...options.value };

  options.value = { ...defaultOptionsRef.value };
  emit('reset', defaultOptionsRef.value, prevOptions, theme);
};

const onOptionsChange = (
  field: keyof TextAlignPanelOptions,
  value: TextAlign,
) => {
  const newOptions: TextAlignPanelOptions = {
    ...options.value,
    [field]: value,
  };

  // 指标和列头对齐 (含 EXTRA_FIELD 虚拟列), 可单独调整指标
  if (field === 'colCellTextAlign') {
    newOptions.dataCellTextAlign = newOptions.colCellTextAlign;
  }

  options.value = newOptions;
};

watch(
  options,
  (newOptions) => {
    const theme = generateCellTextAlignTheme(newOptions);

    emit('change', newOptions, theme);
  },
  { deep: true },
);

const getCellAlignOptions = (field: keyof TextAlignPanelOptions) => {
  return [
    { label: i18n('左对齐'), value: 'left', component: LeftAlignIcon },
    { label: i18n('居中'), value: 'center', component: CenterAlignIcon },
    { label: i18n('右对齐'), value: 'right', component: RightAlignIcon },
  ].map(({ label, value, component: Component }) => ({
    label: h(TooltipWrapper, { title: label }, () =>
      h(Component, { active: options.value[field] === value }),
    ),
    value,
  }));
};

const handleChange = (field: keyof TextAlignPanelOptions, e: any) => {
  onOptionsChange(field, e.target.value);
};
</script>

<template>
  <ResetGroup
    :title="title"
    :defaultCollapsed="defaultCollapsed"
    :class="PRE_CLASS"
    @reset="onResetClick"
  >
    <slot />
    <RadioGroup
      :label="i18n('表头')"
      optionType="button"
      :value="options.colCellTextAlign"
      :options="getCellAlignOptions('colCellTextAlign')"
      onlyIcon
      @change="(e) => handleChange('colCellTextAlign', e)"
    />
    <RadioGroup
      :label="i18n('表身 (维度)')"
      optionType="button"
      :value="options.rowCellTextAlign"
      :options="getCellAlignOptions('rowCellTextAlign')"
      onlyIcon
      @change="(e) => handleChange('rowCellTextAlign', e)"
    />
    <RadioGroup
      :label="i18n('表身 (指标)')"
      optionType="button"
      :value="options.dataCellTextAlign"
      :options="getCellAlignOptions('dataCellTextAlign')"
      onlyIcon
      @change="(e) => handleChange('dataCellTextAlign', e)"
    />
  </ResetGroup>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-text-align-panel {
  width: 340px;
}
</style>
