<script setup lang="ts">
import { ref, computed } from 'vue';
import { i18n } from '@antv/s2';
import { Button } from 'ant-design-vue';
import { isEqual } from 'lodash';
import { ReloadOutlined } from '@ant-design/icons-vue';
import {
  checkItem,
  generateSwitchResult,
  getMainLayoutClassName,
  getSwitcherClassName,
  getSwitcherConfig,
  getSwitcherState,
  shouldCrossRows,
} from './util';
import { SWITCHER_FIELDS, FieldType } from './constant';
import type { SwitcherContentProps, SwitcherState } from './interface';
import Dimension from './dimension/Dimension.vue';

const props = withDefaults(
  defineProps<Omit<SwitcherContentProps, 'onSubmit'>>(),
  {
    contentTitleText: () => i18n('行列切换'),
    resetText: () => i18n('恢复默认'),
    allowExchangeHeader: true,
    sheetType: 'pivot',
  },
);

const emit = defineEmits<{
  (e: 'submit', result: any): void;
  (e: 'toggle-visible'): void;
}>();

const CLASS_NAME_PREFIX = 'content';

const switcherConfig = getSwitcherConfig(props.allowExchangeHeader);
const defaultState = getSwitcherState(props);

const state = ref<SwitcherState>(JSON.parse(JSON.stringify(defaultState)));
const draggingItemId = ref<string | null>(null);

const onReset = () => {
  state.value = JSON.parse(JSON.stringify(defaultState));
};

const onConfirm = () => {
  emit('toggle-visible');
  emit('submit', generateSwitchResult(state.value));
};

const onVisibleItemChange = (
  fieldType: FieldType,
  checked: boolean,
  id: string,
  parentId?: string,
) => {
  const updatedState = checkItem(state.value[fieldType], checked, id, parentId);

  state.value = {
    ...state.value,
    [fieldType]: updatedState,
  };
};

// Check deep equality (simplified for Vue ref)
const isNothingChanged = computed(() => isEqual(defaultState, state.value));

const displayFieldItems = computed(() =>
  SWITCHER_FIELDS.filter(
    (field) => props.sheetType !== 'table' || field === FieldType.Cols,
  ),
);

const onCancel = () => {
  emit('toggle-visible');
};

const mainClass = computed(() => [
  getSwitcherClassName(CLASS_NAME_PREFIX, 'main'),
  getMainLayoutClassName(props.sheetType),
]);
</script>

<template>
  <div
    :class="[innerContentClassName, getSwitcherClassName(CLASS_NAME_PREFIX)]"
  >
    <header :class="getSwitcherClassName(CLASS_NAME_PREFIX, 'header')">
      {{ contentTitleText }}
    </header>
    <main :class="mainClass">
      <Dimension
        v-for="type in displayFieldItems"
        :key="type"
        :fieldType="type"
        :items="state[type]"
        :crossRows="shouldCrossRows(sheetType, type)"
        :draggingItemId="draggingItemId"
        v-bind="switcherConfig[type]"
        @visible-item-change="onVisibleItemChange"
        @update:items="(newItems) => (state[type] = newItems)"
      />
    </main>
    <footer :class="getSwitcherClassName(CLASS_NAME_PREFIX, 'footer')">
      <Button
        type="text"
        :class="
          getSwitcherClassName(CLASS_NAME_PREFIX, 'footer', 'reset-button')
        "
        :disabled="isNothingChanged"
        @click="onReset"
      >
        <template #icon><ReloadOutlined /></template>
        {{ resetText }}
      </Button>
      <div
        :class="getSwitcherClassName(CLASS_NAME_PREFIX, 'footer', 'actions')"
      >
        <Button class="action-button" @click="onCancel">
          {{ i18n('取消') }}
        </Button>
        <Button
          class="action-button"
          type="primary"
          :disabled="isNothingChanged"
          @click="onConfirm"
        >
          {{ i18n('确定') }}
        </Button>
      </div>
    </footer>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
