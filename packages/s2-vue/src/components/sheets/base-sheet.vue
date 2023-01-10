<script lang="ts">
import { S2_PREFIX_CLS } from '@antv/s2';
import { Spin } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { isBoolean } from 'lodash';
import S2Pagination from '../pagination/index.vue';
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
    const { wrapperRef, containerRef, s2Ref, loading, pagination } =
      useSpreadSheet(props, ctx.emit);

    ctx.expose({
      get instance() {
        return s2Ref.value;
      },
    });

    const handlePageChange = (nextCurrent: number) => {
      if (props.showPagination && !isBoolean(props.showPagination)) {
        props.showPagination.onChange?.(nextCurrent);
      }

      pagination.change(nextCurrent);
    };

    const handlePageSizeChange = (nextSize: number) => {
      if (props.showPagination && !isBoolean(props.showPagination)) {
        props.showPagination.onShowSizeChange?.(nextSize);
      }

      pagination.showSizeChange(nextSize);
    };

    return {
      S2_PREFIX_CLS,
      wrapperRef,
      containerRef,
      s2Ref,
      loading,
      pagination,
      handlePageChange,
      handlePageSizeChange,
    };
  },
  components: {
    Spin,
    S2Pagination,
  },
});
</script>

<template>
  <Spin :wrapperClassName="S2_PREFIX_CLS + '-spin'" :spinning="loading">
    <div ref="wrapperRef" :class="S2_PREFIX_CLS + '-wrapper'">
      <div ref="containerRef" :class="S2_PREFIX_CLS + '-container'" />
      <S2Pagination
        v-if="pagination.visible.value"
        :current="pagination.current.value"
        :pageSize="pagination.pageSize.value"
        :total="pagination.total.value"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
  </Spin>
</template>

<style lang="less">
@import '@antv/s2-shared/src/styles/variables.less';

.@{s2-cls-prefix} {
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

  &-pagination {
    display: flex;
    align-items: center;
    z-index: 1024;

    &-count {
      margin-left: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 64px;
    }
  }
}
</style>
