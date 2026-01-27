<script setup lang="ts">
import { S2_PREFIX_CLS, i18n, type S2Theme } from '@antv/s2';
import { Popover } from 'ant-design-vue';
import { h, ref, watch, computed } from 'vue';
import { RadioGroup, ResetGroup, TooltipWrapper } from '../common';
import {
  SheetThemeColorType,
  SheetThemeType,
  DEFAULT_THEME_COLOR_LIST,
} from '../../common-extra';
import ColorBox from './ColorBox.vue';
import {
  BasicThemeIcon,
  ColorfulThemeIcon,
  HierarchyGridTypeIcon,
  HierarchyTreeTypeIcon,
  NormalThemeIcon,
  ZebraThemeIcon,
} from './icons';
import type { ThemePanelOptions } from './interface';
import { generateColorTheme } from './utils';

const PRE_CLASS = `${S2_PREFIX_CLS}-theme-panel`;

const props = withDefaults(
  defineProps<{
    title?: string;
    maxHistoryColorCount?: number;
    disableCustomPrimaryColorPicker?: boolean;
    defaultOptions?: Partial<ThemePanelOptions>;
    defaultCollapsed?: boolean;
  }>(),
  {
    title: () => i18n('主题风格'),
    maxHistoryColorCount: 5,
    disableCustomPrimaryColorPicker: false,
    defaultCollapsed: false,
  },
);

const emit = defineEmits<{
  change: [options: ThemePanelOptions, theme: S2Theme];
  reset: [
    options: ThemePanelOptions,
    prevOptions: ThemePanelOptions,
    theme: S2Theme,
  ];
}>();

const options = ref<ThemePanelOptions>({
  hierarchyType: 'grid',
  themeType: SheetThemeType.DEFAULT,
  colorType: SheetThemeColorType.PRIMARY,
  ...props.defaultOptions,
});

const defaultOptionsRef = ref<ThemePanelOptions>({ ...options.value });
const customColor = ref<string>(DEFAULT_THEME_COLOR_LIST[0]);

const onResetClick = () => {
  const theme = generateColorTheme({
    themeType: defaultOptionsRef.value.themeType as SheetThemeType,
    colorType: defaultOptionsRef.value.colorType as SheetThemeColorType,
    customColor: customColor.value,
  });
  const prevOptions = { ...options.value };

  options.value = { ...defaultOptionsRef.value };
  emit('reset', defaultOptionsRef.value, prevOptions, theme as S2Theme);
};

const onOptionsChange = (field: keyof ThemePanelOptions, value: any) => {
  options.value = {
    ...options.value,
    [field]: value,
  };
};

watch(
  [options, customColor],
  () => {
    const theme = generateColorTheme({
      themeType: options.value.themeType as SheetThemeType,
      colorType: options.value.colorType as SheetThemeColorType,
      customColor: customColor.value,
    });

    emit('change', options.value, theme as S2Theme);
  },
  { deep: true },
);

const hierarchyTypeOptions = computed(() => {
  return [
    { label: i18n('平铺'), value: 'grid', component: HierarchyGridTypeIcon },
    { label: i18n('树状'), value: 'tree', component: HierarchyTreeTypeIcon },
  ].map(({ label, value, component: Component }) => ({
    label: h(TooltipWrapper, { title: label }, () =>
      h(Component, { active: options.value.hierarchyType === value }),
    ),
    value,
  }));
});

const themeTypeOptions = computed(() => {
  return [
    {
      label: i18n('多彩风'),
      value: SheetThemeType.COLORFUL,
      component: ColorfulThemeIcon,
    },
    {
      label: i18n('简约风'),
      value: SheetThemeType.NORMAL,
      component: NormalThemeIcon,
    },
    {
      label: i18n('极简风'),
      value: SheetThemeType.BASIC,
      component: BasicThemeIcon,
    },
    {
      label: i18n('斑马纹风'),
      value: SheetThemeType.ZEBRA,
      component: ZebraThemeIcon,
    },
  ].map(({ label, value, component: Component }) => ({
    label: h(TooltipWrapper, { title: label }, () =>
      h(Component, { active: options.value.themeType === value }),
    ),
    value,
  }));
});

const colorTypeOptions = computed(() => {
  const defaultOptions = [
    { label: i18n('深色主题'), value: SheetThemeColorType.PRIMARY },
    { label: i18n('浅色主题'), value: SheetThemeColorType.SECONDARY },
    { label: i18n('灰色'), value: SheetThemeColorType.GRAY },
  ];

  if (props.disableCustomPrimaryColorPicker) {
    return defaultOptions;
  }

  return [
    ...defaultOptions,
    { label: i18n('自定义'), value: SheetThemeColorType.CUSTOM },
  ];
});

const showCustomColorSection = computed(() => {
  return (
    options.value.colorType === SheetThemeColorType.CUSTOM &&
    !props.disableCustomPrimaryColorPicker
  );
});

const handleHierarchyChange = (e: any) => {
  onOptionsChange('hierarchyType', e.target.value);
};

const handleThemeChange = (e: any) => {
  onOptionsChange('themeType', e.target.value);
};

const handleColorChange = (e: any) => {
  onOptionsChange('colorType', e.target.value);
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
      :label="i18n('类型')"
      optionType="button"
      :value="options.hierarchyType"
      :options="hierarchyTypeOptions"
      onlyIcon
      @change="handleHierarchyChange"
    />
    <RadioGroup
      :label="i18n('主题')"
      optionType="button"
      :value="options.themeType"
      :options="themeTypeOptions"
      onlyIcon
      @change="handleThemeChange"
    />
    <RadioGroup
      :label="i18n('主色系')"
      optionType="button"
      :value="options.colorType"
      :options="colorTypeOptions"
      @change="handleColorChange"
    >
      <template #extra v-if="showCustomColorSection">
        <div :class="`${PRE_CLASS}-custom-color`">
          <div>
            <span :class="`${PRE_CLASS}-custom-color-title`">
              {{ i18n('自定义颜色') }}
            </span>
            <Popover placement="rightTop" trigger="click">
              <template #content>
                <div
                  style="
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    max-width: 160px;
                  "
                >
                  <ColorBox
                    v-for="color in DEFAULT_THEME_COLOR_LIST"
                    :key="color"
                    :color="color"
                    @click="customColor = color"
                  />
                </div>
              </template>
              <ColorBox :color="customColor" />
            </Popover>
          </div>
        </div>
      </template>
    </RadioGroup>
  </ResetGroup>
</template>

<style lang="less">
@import '@antv/s2/esm/styles/variables.less';

.@{s2-cls-prefix}-theme-panel {
  width: 340px;

  &-custom-color {
    margin-top: 8px;

    &-title {
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
}
</style>
