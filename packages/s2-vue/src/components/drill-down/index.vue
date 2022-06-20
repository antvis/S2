<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import type { BaseDataSet, BaseDrillDownComponentProps } from '@antv/s2-shared';
import { Button, Input, Empty, Menu, MenuItem } from 'ant-design-vue';
import type { SelectInfo } from 'ant-design-vue/lib/menu/src/interface';
import _ from 'lodash';
import LocationIcon from '@antv/s2-shared/src/icons/location-icon.svg?component';
import TextIcon from '@antv/s2-shared/src/icons/text-icon.svg?component';
import CalendarIcon from '@antv/s2-shared/src/icons/calendar-icon.svg?component';
import type { Key } from 'ant-design-vue/lib/_util/type';
import {
  initDrillDownEmits,
  initDrillDownProps,
} from '../../utils/initPropAndEmits';

export default defineComponent({
  name: 'DrillDown',
  props: initDrillDownProps(),
  emits: initDrillDownEmits(),
  methods: {},
  components: {
    Button,
    Input,
    Empty,
    Menu,
    MenuItem,
    LocationIcon,
    TextIcon,
    CalendarIcon,
  },
  setup(props) {
    const {
      dataSet,
      disabledFields,
      getDrillFields,
      setDrillFields,
      className,
    } = props as BaseDrillDownComponentProps;
    const PRE_CLASS = 's2-drill-down';
    const getOptions = () => {
      return dataSet.map((val: BaseDataSet) => {
        const item = val;
        item.disabled = !!(
          disabledFields && disabledFields.includes(item.value)
        );
        return item;
      });
    };

    const options: Ref<BaseDataSet[]> = ref(getOptions());
    const selected = ref<Key[]>([]);
    onMounted(() => {
      // console.log(dataSet, 'dataSet');
    });

    const handleSearch = (e: any) => {
      const { value } = e.target;

      if (!value) {
        options.value = [...dataSet];
      } else {
        const reg = new RegExp(value, 'gi');
        const result = dataSet.filter((item) => reg.test(item.name));
        options.value = [...result];
      }
    };

    const handleSelect = (value: SelectInfo) => {
      // console.log(value, 'e.target')
      const key = value?.selectedKeys;
      selected.value = key;
      if (getDrillFields) {
        getDrillFields(key as string[]);
      }
      if (setDrillFields) setDrillFields(key as string[]);
    };

    const handleClear = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selected.value = [];
      if (getDrillFields) getDrillFields([]);
      if (setDrillFields) setDrillFields([]);
    };

    return {
      options,
      handleSearch,
      handleSelect,
      handleClear,
      PRE_CLASS,
      className,
      selected,
      _,
    };
  },
});
</script>

<template>
  <div :class="[PRE_CLASS, className]">
    <header :class="PRE_CLASS + '-header'">
      <div>{{ titleText }}</div>
      <Button type="link" @click="handleClear">
        {{ clearButtonText }}
      </Button>
    </header>
    <Input
      :class="`${PRE_CLASS}-search`"
      :placeholder="searchText"
      @change="handleSearch"
      @pressEnter="handleSearch"
      :allowClear="true"
    />
    <Empty
      v-if="_.isEmpty(options)"
      :imageStyle="{ height: '64px' }"
      :class="`${PRE_CLASS}-empty`"
    />
    <Menu
      class="`${PRE_CLASS}-menu`"
      v-model:selectedKeys="selected"
      @select="handleSelect"
    >
      <MenuItem
        v-for="option in options"
        :key="option.value"
        :disabled="option.disabled"
        :class="`${PRE_CLASS}-menu-item`"
      >
        <template #icon>
          <text-icon v-if="option.type === 'text'" />
          <calendar-icon v-if="option.type === 'date'" />
          <location-icon v-if="option.type === 'location'" />
        </template>
        {{ option?.name }}
      </MenuItem>
    </Menu>
  </div>
</template>

<style lang="less" scoped>
@import '@antv/s2-shared/src/styles/drilldown.less';
</style>
