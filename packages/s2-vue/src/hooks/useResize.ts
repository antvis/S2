import { createResizeObserver } from '@antv/s2-shared';
import type { SpreadSheet } from '@antv/s2';
import { ref, watch, type Ref } from 'vue';
import type { BaseSheetProps } from '../utils/initPropAndEmits';

export const useResize = (
  s2Ref: Ref<SpreadSheet | undefined>,
  props: BaseSheetProps,
  dom: {
    wrapperRef: Ref<HTMLDivElement | undefined>;
    containerRef: Ref<HTMLDivElement | undefined>;
  },
) => {
  const unobserve = ref<() => void>();
  //去掉s2Ref，不然报错replace is not function
  watch(
    [() => props.adaptive],
    ([adaptive], _, onCleanup) => {
      if (!s2Ref) {
        return;
      }
      unobserve.value = createResizeObserver({
        s2: s2Ref.value,
        adaptive,
        wrapper: dom.wrapperRef.value!,
        container: dom.containerRef.value!,
      });

      onCleanup(() => {
        unobserve.value?.();
      });
    },
    { deep: true },
  );
};
