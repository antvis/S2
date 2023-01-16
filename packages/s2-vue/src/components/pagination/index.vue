<script lang="ts">
import { computed, defineComponent } from 'vue';
import { S2_PREFIX_CLS } from '@antv/s2';
import { Pagination as AntDPagination } from 'ant-design-vue';
import { i18n } from '@antv/s2';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../hooks/usePagination';

const PRE_CLASS = `${S2_PREFIX_CLS}-pagination`;

export default defineComponent({
  name: 's2-pagination',
  props: {
    current: {
      type: Number,
      default: DEFAULT_PAGE_NUMBER,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: DEFAULT_PAGE_SIZE,
    },
  },
  emits: ['change', 'showSizeChange'] as unknown as {
    change: (current: number) => void;
    showSizeChange: (size: number) => void;
  },
  setup: (props) => {
    // only show the pagination when the pageSize > 5
    const showQuickJumper = computed(() => props.total / props.pageSize > 5);

    return {
      showQuickJumper,
      PRE_CLASS,
      i18n,
    };
  },
  components: {
    AntDPagination,
  },
});
</script>

<template>
  <div :class="PRE_CLASS">
    <AntDPagination
      :default-current="1"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :showSizeChanger="true"
      @showSizeChange="(_, size) => $emit('showSizeChange', size)"
      size="small"
      :showQuickJumper="showQuickJumper"
      @change="(current) => $emit('change', current)"
    />
    <span :class="`${PRE_CLASS}-count`">
      {{ i18n('共计') }} {{ total || ' - ' }} {{ i18n('条') }}
    </span>
  </div>
</template>
