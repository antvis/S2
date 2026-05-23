<script setup lang="ts">
import { ref, watch, computed, h } from 'vue';
import { Button, Empty, Input, Menu, type MenuProps } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { DRILL_DOWN_PRE_CLASS, i18n } from '@antv/s2';
import { isEmpty } from 'lodash';
import { CalendarIcon, LocationIcon, TextIcon } from '../common/icons';
import type { DrillDownDataSet, DrillDownProps } from './interface';

const props = withDefaults(defineProps<DrillDownProps>(), {
  title: () => i18n('选择下钻维度'),
  clearText: () => i18n('恢复默认'),
  searchText: () => i18n('搜索字段'),
  drillFields: () => [],
  dataSet: () => [],
});

const emit = defineEmits<{
  (e: 'update:drillFields', val: string[]): void;
}>();

const DRILL_DOWN_ICON_MAP: Record<string, any> = {
  text: h(TextIcon),
  location: h(LocationIcon),
  date: h(CalendarIcon),
};

const getOptions = () => {
  return props.dataSet.map((item) => {
    const newItem = { ...item };

    newItem.disabled = !!(
      props.disabledFields && props.disabledFields.includes(item.value)
    );

    return newItem;
  });
};

const options = ref<DrillDownDataSet[]>(getOptions());

watch(
  () => props.disabledFields,
  () => {
    options.value = getOptions();
  },
  { deep: true },
);

const handleSearch = (e: any) => {
  const { value } = e.target;

  if (!value) {
    options.value = getOptions();
  } else {
    const reg = new RegExp(value, 'gi');
    const result = getOptions().filter((item) => reg.test(item.name));

    options.value = result;
  }
};

const handleSelect = (info: any) => {
  const { selectedKeys } = info;

  emit('update:drillFields', selectedKeys);
};

const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  emit('update:drillFields', []);
};

const menuItems = computed<MenuProps['items']>(() =>
  options.value.map((option) => ({
    key: option.value,
    label: option.name,
    disabled: option.disabled,
    class: `${DRILL_DOWN_PRE_CLASS}-menu-item`,
    icon: option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type!],
  })),
);

const selectedKeys = computed(() => props.drillFields);
</script>

<template>
  <div :class="[DRILL_DOWN_PRE_CLASS, className]">
    <header :class="`${DRILL_DOWN_PRE_CLASS}-header`">
      <div :class="`${DRILL_DOWN_PRE_CLASS}-header-title`">{{ title }}</div>
      <Button type="link" :disabled="isEmpty(drillFields)" @click="handleClear">
        {{ clearText }}
      </Button>
    </header>
    <Input
      :class="`${DRILL_DOWN_PRE_CLASS}-search`"
      :placeholder="searchText"
      @change="handleSearch"
      @pressEnter="handleSearch"
      :allowClear="true"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </Input>

    <Empty
      v-if="isEmpty(options)"
      :imageStyle="{ height: '64px' }"
      :class="`${DRILL_DOWN_PRE_CLASS}-empty`"
    />

    <slot name="extra">
      <!-- Prop 'extra' fallback if needed, but slots are better -->
    </slot>

    <!-- Menu Render Logic -->
    <Menu
      :class="`${DRILL_DOWN_PRE_CLASS}-menu`"
      :selectedKeys="selectedKeys"
      @select="handleSelect"
      :items="menuItems"
    />
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
