<script lang="ts" setup>
import { S2_PREFIX_CLS } from '@antv/s2';
import type { BaseSheetComponentProps } from '@antv/s2-shared';
import { Spin } from 'ant-design-vue';
import { useSpreadSheet } from '../../hooks/useSpreadSheet';
import {
  initBaseSheetEmitKeys,
  initBaseSheetPropKeys,
} from '../../utils/initProps';

const props = defineProps(initBaseSheetPropKeys());
const emits = defineEmits(initBaseSheetEmitKeys());

const { wrapRef, containerRef, s2Ref, loading } = useSpreadSheet(
  props as Readonly<BaseSheetComponentProps>,
);

// console.log("props & emit:",props,emits)

defineExpose(s2Ref);
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
