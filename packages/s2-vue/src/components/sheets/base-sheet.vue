<script lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { Spin } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { useSpreadSheet } from '../../hooks/useSpreadSheet';
import {
  initBaseSheetEmits,
  initBaseSheetProps,
} from '../../utils/initPropAndEmits';

export default defineComponent({
  name: 'BaseSheet',
  props: initBaseSheetProps(),
  emits: initBaseSheetEmits(),
  setup(props, ctx) {
    const { wrapRef, containerRef, s2Ref, loading } = useSpreadSheet(
      props,
      ctx.emit,
    );

    ctx.expose({ instance: s2Ref });
    return { S2_PREFIX_CLS, wrapRef, containerRef, s2Ref, loading };
  },
  components: {
    Spin,
  },
});
</script>

<template>
  <Spin :wrapperClassName="S2_PREFIX_CLS + '-spin'" :spinning="loading">
    <div ref="wrapRef" :class="S2_PREFIX_CLS + '-wrapper'">
      <div ref="containerRef" :class="S2_PREFIX_CLS + '-container'" />
    </div>
  </Spin>
</template>

<style lang="less">
@import '../../styles/variable.less';

.@{preCls} {
  &-spin.ant-spin-nested-loading,
  &-spin > .ant-spin-container {
    height: 100%;
  }

  &-wrapper {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &-container {
    overflow: auto;
    flex: 1 1 auto;

    canvas {
      display: block;
    }
  }
}
</style>
