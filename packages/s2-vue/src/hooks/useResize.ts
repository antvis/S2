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

  const render = (width: number, height: number) => {
    s2Ref.value?.changeSheetSize(width, height);
    s2Ref.value?.render(false);
  };
  watch(
    [s2Ref, () => props.adaptive],
    ([s2, adaptive], _, onCleanup) => {
      if (!s2) {
        return;
      }
      unobserve.value = createResizeObserver({
        s2,
        adaptive,
        wrapper: dom.wrapperRef.value!,
        container: dom.containerRef.value!,
        render,
      });

      onCleanup(() => {
        unobserve.value?.();
      });
    },
    { deep: true, immediate: true },
  );
};
