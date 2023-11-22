<script lang="ts">
import { getTooltipDefaultOptions } from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../interface';
import TooltipDetail from './components/detail.vue';
import TooltipHeadInfo from './components/head-info.vue';
import TooltipInfos from './components/infos.vue';
import TooltipSimpleTips from './components/simple-tips.vue';
import TooltipSummary from './components/summary.vue';
import { TooltipOperator } from './components/operator';
import type { TooltipRenderProps } from './interface';

export default defineComponent({
  name: 'TooltipComponent',
  props: [
    'data',
    'options',
    'cell',
    'position',
    'event',
    'content',
  ] as unknown as GetInitProps<TooltipRenderProps>,
  setup(props) {
    const { operator, onlyShowOperator } = getTooltipDefaultOptions(
      props.options,
    );

    return {
      operator,
      onlyShowOperator,
    };
  },
  components: {
    TooltipDetail,
    TooltipHeadInfo,
    TooltipInfos,
    TooltipSimpleTips,
    TooltipSummary,
    TooltipOperator,
  },
});
</script>

<template>
  <template v-if="onlyShowOperator">
    <TooltipOperator
      :menu="operator?.menu"
      :onlyShowOperator="true"
      :cell="cell"
    />
  </template>
  <template v-else>
    <TooltipOperator
      :menu="operator?.menu"
      :onlyShowOperator="false"
      :cell="cell"
    />

    <template v-if="content">
      <slot name="content"></slot>
    </template>

    <template v-else>
      <TooltipSimpleTips :name="data?.name" :tips="data?.tips" />
      <TooltipSummary
        v-if="data?.summaries?.length"
        :summaries="data?.summaries"
      />
      <TooltipHeadInfo
        :rows="data?.headInfo?.rows || []"
        :cols="data?.headInfo?.cols || []"
      />
      <TooltipDetail :list="data?.details || []" />
      <TooltipInfos v-if="data?.infos" :infos="data?.infos" />
    </template>
  </template>
</template>

<style lang="less">
@import '@antv/s2/src/ui/tooltip/index.less';
@import '@antv/s2-shared/src/styles/tooltip/index.less';
</style>
