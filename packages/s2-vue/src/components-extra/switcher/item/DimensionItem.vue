<script setup lang="ts">
import { computed } from 'vue';
import { isEmpty } from 'lodash';
import { getSwitcherClassName } from '../util';
import type { SwitcherItem, DimensionCommonProps } from '../interface';
import SingleItem from './SingleItem.vue';

interface DimensionItemProps extends DimensionCommonProps {
  index?: number;
  item: SwitcherItem;
  expandChildren: boolean;
  isDragDisabled: boolean;
}

const props = defineProps<DimensionItemProps>();

const emit = defineEmits<{
  (
    e: 'visible-item-change',
    fieldType: string,
    checked: boolean,
    id: string,
    parentId?: string,
  ): void;
}>();

const onVisibleItemChange = (
  fieldType: string,
  checked: boolean,
  id: string,
  parentId?: string,
) => {
  emit('visible-item-change', fieldType, checked, id, parentId);
};

// Use classes array
const mainClass = computed(() => {
  return [
    getSwitcherClassName(props.selectable ? 'checkable-list' : 'normal-list'),
    {
      'disable-dragging': props.isDragDisabled,
    },
  ];
});

// Item class
const itemClass = computed(() => {
  return [
    props.selectable ? 'checkable-item' : 'normal-item',
    {
      'item-collapse': !props.expandChildren,
    },
    // join for class string if passed as prop
  ].join(' ');
});
</script>

<template>
  <div :class="mainClass">
    <SingleItem
      :fieldType="fieldType"
      :id="item.id"
      :displayName="item.displayName"
      :checked="item.checked"
      :selectable="selectable"
      :className="itemClass"
      @visible-item-change="onVisibleItemChange"
    />

    <div
      v-if="
        expandable &&
        expandChildren &&
        !isEmpty(item.children) &&
        draggingItemId !== item.id
      "
      :class="['child-items', { 'item-hidden': !expandChildren }]"
    >
      <SingleItem
        v-for="child in item.children"
        :key="child.id"
        :id="child.id"
        :fieldType="fieldType"
        :displayName="child.displayName"
        :disabled="!item.checked"
        :checked="child.checked"
        :parentId="item.id"
        :selectable="selectable"
        class="checkable-item"
        @visible-item-change="onVisibleItemChange"
      />
    </div>
  </div>
</template>
