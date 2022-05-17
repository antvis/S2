<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  watchEffect,
  watchPostEffect,
} from 'vue';
import type { BaseDataSet, BaseDrillDownComponentProps } from '@antv/s2-shared';
import { Button, Input, Empty, Menu, MenuItem } from 'ant-design-vue';
import _ from 'lodash';
import ColIcon from '@antv/s2-shared/src/icons/col-icon.svg?component';
import RowIcon from '@antv/s2-shared/src/icons/row-icon.svg';
import {
  initDrillDownEmits,
  initDrillDownProps,
} from '../../utils/initPropAndEmits';

export default defineComponent({
  name: 'DrillDown',
  props: initDrillDownProps(),
  emits: initDrillDownEmits(),
  components: { Button, Input, Empty, Menu, MenuItem, ColIcon, RowIcon },
  methods: {
    // _() {
    //   return _;
    // }
  },
  setup(props, ctx) {
    const {
      dataSet,
      disabledFields,
      getDrillFields,
      setDrillFields,
      className,
    } = props as BaseDrillDownComponentProps;
    const PRE_CLASS = 's2-drill-down';
    // const DRILL_DOWN_ICON_MAP = {
    //   text: <ColIcon />,
    //   location: <ColIcon />,
    //   date: <ColIcon />,
    // };
    const getOptions = () => {
      return dataSet.map((val: BaseDataSet) => {
        const item = val;
        item.disabled = !!(
          disabledFields && disabledFields.includes(item.value)
        );
        return item;
      });
    };

    let options: BaseDataSet[] = reactive(getOptions());

    onMounted(() => {
      // console.log(dataSet, 'dataSet');
    });
    //
    // watch(disabledFields, () => {
    //   options = getOptions();
    // })

    const handleSearch = (e: any) => {
      const { value } = e.target;

      if (!value) {
        options = [...dataSet];
      } else {
        const reg = new RegExp(value, 'gi');
        const result = dataSet.filter((item) => reg.test(item.name));
        options = [...result];
      }
    };

    const handleSelect = (value: any) => {
      const key = value?.selectedKeys;
      if (getDrillFields) {
        getDrillFields([...key]);
      }
      if (setDrillFields) setDrillFields([...key]);
    };

    const handleClear = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
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
      _,
    };
  },
});
</script>

<template>
  <div :class="[PRE_CLASS, className]">
    <header :class="PRE_CLASS + '-header'">
      <div>{{ titleText }}</div>
      <Button
        type="link"
        :disabled="_.isEmpty(drillFields)"
        @click="handleClear"
      >
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
    <!--    <slot></slot>-->
    <Menu
      class="`${PRE_CLASS}-menu`"
      v-model:selectedKeys="selectedKeys"
      @select="handleSelect"
    >
      <MenuItem
        v-for="option in options"
        :key="option.value"
        :disabled="option.disabled"
        :class="`${PRE_CLASS}-menu-item`"
      >
        <template #icon>
          <!--          option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type]-->
          <col-icon />
          <row-icon />
        </template>
        {{ option?.name }}
      </MenuItem>
    </Menu>
  </div>
</template>

<style lang="less" scoped>
@import 'index.less';
</style>
