import {
  S2Event,
  type EmitterType,
  type Pagination,
  type SpreadSheet,
} from '@antv/s2';
import { isEmpty, omit } from 'lodash';
import { computed, ref, watch, type Ref } from 'vue';
import type { BaseSheetProps } from '../utils/initPropAndEmits';

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const usePagination = (
  s2Ref: Ref<SpreadSheet | undefined>,
  props: BaseSheetProps,
) => {
  const {
    options: { pagination: paginationCfg },
    showPagination,
  } = props;
  const current = ref(paginationCfg?.current ?? DEFAULT_PAGE_NUMBER);
  const pageSize = ref(paginationCfg?.pageSize ?? DEFAULT_PAGE_SIZE);
  const total = ref(0);

  const change = (nextCurrent: number) => {
    current.value = nextCurrent;
  };

  const showSizeChange = (nextPageSize: number) => {
    pageSize.value = nextPageSize;
  };

  const visible = computed(() => {
    return showPagination && !isEmpty(paginationCfg);
  });

  // sync state.pagination -> s2.pagination
  watch([current, pageSize], async () => {
    if (!s2Ref.value) {
      return;
    }

    const nextPagination = isEmpty(paginationCfg)
      ? (null as unknown as Pagination)
      : {
          current: current.value,
          pageSize: pageSize.value,
        };

    s2Ref.value.updatePagination(nextPagination);
    await s2Ref.value.render(false);
  });

  // sync props.pagination -> state.pagination
  watch(
    [() => paginationCfg, s2Ref],
    () => {
      current.value = paginationCfg?.current ?? DEFAULT_PAGE_NUMBER;
      pageSize.value = paginationCfg?.pageSize ?? DEFAULT_PAGE_SIZE;
      total.value = s2Ref.value?.facet?.viewCellHeights.getTotalLength() ?? 0;
    },
    {
      immediate: true,
    },
  );

  // sync layout result total -> state.total
  watch(s2Ref, (value, oldValue, onCleanup) => {
    if (!s2Ref.value) {
      return;
    }

    const totalUpdateCallback: EmitterType[S2Event.LAYOUT_PAGINATION] = (
      data,
    ) => {
      if (isEmpty(paginationCfg)) {
        return;
      }

      total.value = data.total;
    };

    s2Ref.value.on(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);

    onCleanup(() => {
      s2Ref.value?.off(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);
    });
  });

  return {
    customOptions: omit(paginationCfg, ['current', 'pageSize', 'total']),
    visible,
    current,
    pageSize,
    total,
    change,
    showSizeChange,
  };
};
