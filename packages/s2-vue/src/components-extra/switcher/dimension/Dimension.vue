<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Checkbox } from 'ant-design-vue';
import { i18n } from '@antv/s2';
import draggable from 'vuedraggable';
import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface';
import { getSwitcherClassName } from '../util';
import DimensionItem from '../item/DimensionItem.vue';
import type { SwitcherItem } from '../interface';
import { FieldType } from '../constant';

// Define Props
interface DimensionProps {
  // SwitcherField
  items?: SwitcherItem[];
  allowEmpty?: boolean;
  expandable?: boolean;
  expandText?: string;
  selectable?: boolean;

  // DimensionCommonProps
  fieldType: FieldType;
  draggingItemId?: string | null;

  // Extra
  droppableType?: string;
  text?: string;
  icon?: any;
  crossRows?: boolean;
}

const props = withDefaults(defineProps<DimensionProps>(), {
  items: () => [],
  crossRows: false,
  selectable: false,
  expandable: false,
  expandText: () => i18n('展开子项'),
  allowEmpty: true,
});

const emit = defineEmits<{
  (
    e: 'visible-item-change',
    fieldType: string,
    checked: boolean,
    id: string,
    parentId?: string,
  ): void;
  // vuedraggable requires v-model:list or list prop + @change
  // But here we rely on the parent state update logic. Wait, vuedraggable mutates the array?
  // Ideally we should emit an update.
  (e: 'update:items', items: SwitcherItem[]): void;
}>();

const CLASS_NAME_PREFIX = 'dimension';

const expandChildren = ref(true);
const enabled = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    enabled.value = true;
  });
});

const onUpdateExpand = (event: CheckboxChangeEvent) => {
  expandChildren.value = event.target.checked;
};

// If allowEmpty is false and only one item, disable drag
const isDragDisabled = computed(
  () => !props.allowEmpty && props.items.length === 1,
);

const onVisibleItemChange = (
  fieldType: string,
  checked: boolean,
  id: string,
  parentId?: string,
) => {
  emit('visible-item-change', fieldType, checked, id, parentId);
};

// Draggable config
const dragOptions = computed(() => ({
  animation: 200,
  // allow drag between same group
  group: props.droppableType,
  disabled: isDragDisabled.value,
  ghostClass: getSwitcherClassName(CLASS_NAME_PREFIX, 'items-highlight'),
}));

// We need a writable computed for v-model
const list = computed({
  get: () => props.items,
  set: (val) => {
    emit('update:items', val);
  },
});
</script>

<template>
  <div
    v-if="enabled"
    :class="[
      getSwitcherClassName(CLASS_NAME_PREFIX),
      { 'long-dimension': crossRows },
    ]"
  >
    <div :class="getSwitcherClassName(CLASS_NAME_PREFIX, 'header')">
      <div class="title">
        <component :is="icon" /> <span>{{ text }}</span>
      </div>
      <div v-if="expandable" class="expand-option">
        <Checkbox :checked="expandChildren" @change="onUpdateExpand">
          {{ expandText }}
        </Checkbox>
      </div>
    </div>

    <draggable
      v-model="list"
      item-key="id"
      v-bind="dragOptions"
      :class="[
        getSwitcherClassName(CLASS_NAME_PREFIX, 'items'),
        { [getSwitcherClassName(CLASS_NAME_PREFIX, 'long-items')]: crossRows },
      ]"
    >
      <template #item="{ element, index }">
        <DimensionItem
          :index="index"
          :fieldType="fieldType"
          :item="element"
          :expandable="expandable"
          :expandChildren="expandChildren"
          :selectable="selectable"
          :isDragDisabled="isDragDisabled"
          @visible-item-change="onVisibleItemChange"
        />
      </template>
    </draggable>
  </div>
</template>
