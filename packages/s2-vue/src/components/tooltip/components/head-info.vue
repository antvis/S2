<script lang="ts">
import { type TooltipHeadInfo, TOOLTIP_PREFIX_CLS, i18n } from '@antv/s2';
import { computed, defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';

export default defineComponent({
  name: 'TooltipHeadInfo',
  props: ['rows', 'cols'] as unknown as GetInitProps<TooltipHeadInfo>,
  setup(props) {
    const colsText = computed(() =>
      (props.cols || []).map((item) => item.value).join('/'),
    );
    const rowsText = computed(() =>
      (props.rows || []).map((item) => item.value).join('/'),
    );
    const separator = computed(() =>
      (props.cols?.length ?? 0) > 0 && (props.rows?.length ?? 0) > 0
        ? i18n('，')
        : '',
    );

    return {
      TOOLTIP_PREFIX_CLS,
      colsText,
      rowsText,
      separator,
    };
  },
});
</script>

<template>
  <div
    v-if="cols?.length || rows?.length"
    :class="`${TOOLTIP_PREFIX_CLS}-head-info-list`"
  >
    {{ colsText }}{{ separator }}{{ rowsText }}
  </div>
</template>

<style lang="less"></style>
