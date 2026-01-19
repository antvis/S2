<script lang="ts">
import {
  TOOLTIP_PREFIX_CLS,
  type TooltipInterpretationOptions,
} from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';
import TooltipIcon from './icon.vue';

export default defineComponent({
  name: 'TooltipInterpretation',
  props: [
    'name',
    'icon',
    'text',
    'content',
  ] as unknown as GetInitProps<TooltipInterpretationOptions>,
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
    };
  },
  components: {
    TooltipIcon,
  },
});
</script>

<template>
  <div :class="`${TOOLTIP_PREFIX_CLS}-interpretation`">
    <div :class="`${TOOLTIP_PREFIX_CLS}-interpretation-head`">
      <TooltipIcon
        :icon="icon"
        :class="`${TOOLTIP_PREFIX_CLS}-interpretation-icon`"
      />
      <span v-if="name" :class="`${TOOLTIP_PREFIX_CLS}-interpretation-name`">
        {{ name }}
      </span>
    </div>
    <div v-if="text">{{ text }}</div>
    <slot v-if="content" name="content">
      <component v-if="typeof content === 'object'" :is="content" />
      <span v-else>{{ content }}</span>
    </slot>
  </div>
</template>

<style lang="less"></style>
