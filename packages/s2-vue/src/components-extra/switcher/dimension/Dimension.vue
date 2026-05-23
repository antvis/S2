<script setup lang="ts">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Checkbox } from 'ant-design-vue';
import { i18n } from '@antv/s2';
// Use sortablejs instead of vuedraggable to avoid ESM build issues (require is not defined) in Vite
import Sortable from 'sortablejs';
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
  (e: 'update:items', items: SwitcherItem[]): void;
}>();

const CLASS_NAME_PREFIX = 'dimension';

const expandChildren = ref(true);
const enabled = ref(false);
const draggableRef = ref<HTMLElement>();
let sortableInstance: Sortable | null = null;

const onUpdateExpand = (event: CheckboxChangeEvent) => {
  expandChildren.value = event.target.checked;
};

// If allowEmpty is false and only one item, disable drag
const isDragDisabled = computed(
  () => !props.allowEmpty && props.items.length === 1,
);

const initSortable = () => {
  if (!draggableRef.value) {
    return;
  }

  sortableInstance = Sortable.create(draggableRef.value, {
    animation: 200,
    group: props.droppableType,
    disabled: isDragDisabled.value,
    ghostClass: getSwitcherClassName(CLASS_NAME_PREFIX, 'items-highlight'),
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;

      if (
        oldIndex === undefined ||
        newIndex === undefined ||
        oldIndex === newIndex
      ) {
        return;
      }

      // Sync state
      const newItems = [...props.items];
      const [movedItem] = newItems.splice(oldIndex, 1);

      newItems.splice(newIndex, 0, movedItem);
      emit('update:items', newItems);
    },
  });
};

watch(isDragDisabled, (val) => {
  sortableInstance?.option('disabled', val);
});

onMounted(() => {
  requestAnimationFrame(() => {
    enabled.value = true;
    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      initSortable();
    });
  });
});

onBeforeUnmount(() => {
  sortableInstance?.destroy();
});

const onVisibleItemChange = (
  fieldType: string,
  checked: boolean,
  id: string,
  parentId?: string,
) => {
  emit('visible-item-change', fieldType, checked, id, parentId);
};
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

    <div
      ref="draggableRef"
      :class="[
        getSwitcherClassName(CLASS_NAME_PREFIX, 'items'),
        { [getSwitcherClassName(CLASS_NAME_PREFIX, 'long-items')]: crossRows },
      ]"
    >
      <DimensionItem
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :fieldType="fieldType"
        :item="item"
        :expandable="expandable"
        :expandChildren="expandChildren"
        :selectable="selectable"
        :isDragDisabled="isDragDisabled"
        @visible-item-change="onVisibleItemChange"
      />
    </div>
  </div>
</template>
