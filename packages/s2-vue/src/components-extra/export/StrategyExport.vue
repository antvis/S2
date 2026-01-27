<script setup lang="ts">
import { strategyCopy } from '@antv/s2';
import Export from './Export.vue';
import type { ExportProps } from './interface';

const props = defineProps<ExportProps>();
</script>

<template>
  <Export v-bind="props" :customCopyMethod="strategyCopy">
    <template v-if="$slots['default']" #default>
      <slot name="default" />
    </template>
  </Export>
</template>
