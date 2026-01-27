<script setup lang="ts">
import { Checkbox } from 'ant-design-vue';
import { getSwitcherClassName } from '../util';

interface SingleItemProps {
  id: string;
  className?: string;
  fieldType: string;
  displayName?: string;
  checked?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  parentId?: string;
}

const props = withDefaults(defineProps<SingleItemProps>(), {
  checked: true,
  disabled: false,
  selectable: false,
});

const emit = defineEmits<{
  (
    e: 'visible-item-change',
    fieldType: string,
    checked: boolean,
    id: string,
    parentId?: string,
  ): void;
}>();

const textClassName = getSwitcherClassName('item', 'text');

const onChange = (e: any) => {
  emit(
    'visible-item-change',
    props.fieldType,
    e.target.checked,
    props.id,
    props.parentId,
  );
};
</script>

<template>
  <div :class="[getSwitcherClassName('item'), className]">
    <Checkbox
      v-if="selectable"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <span :class="textClassName" :title="displayName">
      {{ displayName || id }}
    </span>
  </div>
</template>
