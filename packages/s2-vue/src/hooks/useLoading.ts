import { S2Event, type SpreadSheet } from '@antv/s2';
import { ref, watch, type ShallowRef } from 'vue';
import { drawDottedLines } from '../../../s2-core/src/extends/pivot-chart/utils/polyline-axis';

export const useLoading = (
  s2Ref: ShallowRef<SpreadSheet | undefined>,
  loadingProp = false,
) => {
  const loading = ref<boolean>(loadingProp);
  const setLoading = (updated: boolean) => {
    loading.value = updated;
  };

  watch(s2Ref, (s2) => {
    s2?.on(S2Event.LAYOUT_BEFORE_RENDER, () => {
      setLoading(true);
    });

    s2?.on(S2Event.LAYOUT_AFTER_RENDER, () => {
      setLoading(false);
    });
    s2?.on(S2Event.GLOBAL_SCROLL, () => {
      drawDottedLines(s2);
    });
  });

  return { loading, setLoading };
};
