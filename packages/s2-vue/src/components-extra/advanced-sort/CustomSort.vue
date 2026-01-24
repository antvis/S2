<script setup lang="ts">
import {
  DownOutlined,
  UpOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons-vue';
import { ADVANCED_SORT_PRE_CLS } from '@antv/s2';
import { Card } from 'ant-design-vue';
import type { CustomSortProps } from './interface';

const props = defineProps<CustomSortProps>();
const emit = defineEmits<{
  (e: 'split-orders-change', orders: string[]): void;
}>();

const moveToTopHandler = (value: string) => {
  const res = [...props.splitOrders];
  const index = res.indexOf(value);

  if (index > 0) {
    res.splice(index, 1);
    res.unshift(value);
    emit('split-orders-change', res);
  }
};

const moveUpHandler = (value: string) => {
  const res = [...props.splitOrders];
  const index = res.indexOf(value);

  if (index > 0) {
    res.splice(index, 1);
    res.splice(index - 1, 0, value);
    emit('split-orders-change', res);
  }
};

const moveDownHandler = (value: string) => {
  const res = [...props.splitOrders];
  const index = res.indexOf(value);

  if (index < res.length - 1) {
    res.splice(index, 1);
    res.splice(index + 1, 0, value);
    emit('split-orders-change', res);
  }
};
</script>

<template>
  <Card :class="`${ADVANCED_SORT_PRE_CLS}-card-content`">
    <li
      v-for="value in splitOrders"
      :key="value"
      :class="`${ADVANCED_SORT_PRE_CLS}-split-value`"
      :title="value"
    >
      <span class="split-text">{{ value }}</span>
      <span
        :class="`${ADVANCED_SORT_PRE_CLS}-split-icon`"
        @click="() => moveToTopHandler(value)"
      >
        <VerticalAlignTopOutlined />
      </span>
      <span
        :class="`${ADVANCED_SORT_PRE_CLS}-split-icon`"
        @click="() => moveDownHandler(value)"
      >
        <DownOutlined />
      </span>
      <span
        :class="`${ADVANCED_SORT_PRE_CLS}-split-icon`"
        @click="() => moveUpHandler(value)"
      >
        <UpOutlined />
      </span>
    </li>
  </Card>
</template>
