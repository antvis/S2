<script setup lang="ts">
import { ref } from 'vue';
import {
  ResizeType,
  customMerge,
  type ResizeInteractionOptions,
  type S2Theme,
  type ThemeCfg,
  type S2Options,
} from '@antv/s2';

// Define props
const props = defineProps<{
  options: S2Options;
  setThemeCfg: (cb: (theme: ThemeCfg) => ThemeCfg) => void;
  setOptions: (cb: (prev: S2Options) => S2Options) => void;
  onMaxLinesChange?: (maxLines: number) => void;
}>();

const RESIZE_CONFIG = [
  { label: '角头热区', value: 'cornerCellHorizontal' },
  { label: '行头热区', value: 'rowCellVertical' },
  { label: '列头水平方向resize热区', value: 'colCellHorizontal' },
  { label: '列头垂直方向resize热区', value: 'colCellVertical' },
];

const showResizeArea = ref(false);
const checkedResizeAreas = ref<string[]>(
  RESIZE_CONFIG.map((item) => item.value),
);
const maxLines = ref(props.options?.style?.dataCell?.maxLines ?? 1);

const onShowResizeAreaChange = (checked: boolean) => {
  const theme: S2Theme = {
    resizeArea: {
      backgroundOpacity: checked ? 1 : 0,
    },
  };

  showResizeArea.value = checked;
  props.setThemeCfg((prev) => customMerge<ThemeCfg>(prev, { theme }));
};

const onSwitchResizeType =
  (type: 'rowResizeType' | 'colResizeType') => (checked: boolean) => {
    const options: S2Options = {
      interaction: {
        resize: {
          [type]: checked ? ResizeType.CURRENT : ResizeType.ALL,
        },
      },
      style: {
        rowCell: {
          heightByField: null,
          widthByField: null,
        },
        colCell: {
          heightByField: null,
          widthByField: null,
        },
      },
    };

    props.setOptions((prev) => customMerge<S2Options>(prev, options));
  };

const onResizeActiveChange = (checkedAreas: string[]) => {
  const resize = RESIZE_CONFIG.reduce((cfg, item) => {
    const type = item.value;

    // @ts-ignore
    cfg[type] = checkedAreas.includes(type);

    return cfg;
  }, {});

  const updatedOptions: S2Options = {
    interaction: {
      resize,
    },
  };

  props.setOptions((prev) => customMerge<S2Options>(prev, updatedOptions));
  checkedResizeAreas.value = checkedAreas;
};

const onMaxLinesLineChange = (e: any) => {
  const lines = e.target.value;

  maxLines.value = lines;

  const updatedOptions: S2Options = {
    style: {
      rowCell: { maxLines: lines },
      colCell: { maxLines: lines },
      cornerCell: { maxLines: lines },
      dataCell: { maxLines: lines },
    },
  };

  props.setOptions((prev) => customMerge<S2Options>(prev, updatedOptions));
  props.onMaxLinesChange?.(lines);
};

// Compute resize config for switches
const resizeConfig = () =>
  props.options.interaction?.resize as ResizeInteractionOptions;
</script>

<template>
  <div class="resize-config-container">
    <a-space class="filter-container">
      <span class="label">
        热区配置
        <a-divider type="vertical" />
      </span>
      <a-switch
        checked-children="宽高调整热区开"
        un-checked-children="宽高调整热区关"
        :checked="showResizeArea"
        @change="onShowResizeAreaChange"
      />
      <a-checkbox-group
        :options="RESIZE_CONFIG"
        v-model:value="checkedResizeAreas"
        @change="onResizeActiveChange"
      />
      <a-tooltip title="行头高度调整时只影响当前行, 还是所有行">
        <a-switch
          checked-children="行高单行调整开"
          un-checked-children="行高单行调整关"
          :checked="resizeConfig()?.rowResizeType === ResizeType.CURRENT"
          @change="onSwitchResizeType('rowResizeType')"
        />
      </a-tooltip>
      <a-tooltip title="列头宽度调整时只影响当前列, 还是所有列">
        <a-switch
          checked-children="列宽单行调整开"
          un-checked-children="列宽单行调整关"
          :checked="resizeConfig()?.colResizeType === ResizeType.CURRENT"
          @change="onSwitchResizeType('colResizeType')"
        />
      </a-tooltip>
    </a-space>
    <a-space class="filter-container">
      <span class="label">
        换行配置
        <a-divider type="vertical" />
      </span>
      <a-tooltip title="最大行数，文本超出后将被截断">
        <a-radio-group :value="maxLines" @change="onMaxLinesLineChange">
          <a-radio-button v-for="i in 6" :key="i" :value="i">
            {{ i }}行
          </a-radio-button>
        </a-radio-group>
      </a-tooltip>
    </a-space>
  </div>
</template>
