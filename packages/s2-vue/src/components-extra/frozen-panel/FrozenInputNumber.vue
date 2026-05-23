<script setup lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { InputNumber } from 'ant-design-vue';
import { debounce } from 'lodash';
import { ref, watch, onBeforeUnmount } from 'vue';

const PRE_CLASS = `${S2_PREFIX_CLS}-frozen-input-number`;

const props = withDefaults(
  defineProps<{
    value?: number | null;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    size?: 'large' | 'middle' | 'small';
  }>(),
  {
    value: null,
    disabled: false,
    min: 0,
    max: 20,
    step: 1,
    size: 'small',
  },
);

const emit = defineEmits<{
  change: [value: number | null];
}>();

const inputValue = ref<number | string | null>(props.value);

const onDebounceChange = debounce((nextValue: number | null) => {
  emit('change', nextValue);
}, 500);

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue;
    }
  },
);

onBeforeUnmount(() => {
  onDebounceChange.cancel();
});

const handleChange = (nextValue: number | string | null) => {
  inputValue.value = nextValue;
  onDebounceChange(nextValue as number | null);
};
</script>

<template>
  <InputNumber
    :class="PRE_CLASS"
    :size="size"
    :min="min"
    :max="max"
    :step="step"
    :precision="0"
    :disabled="disabled"
    :value="inputValue"
    @change="handleChange"
  />
</template>
