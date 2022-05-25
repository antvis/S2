import { S2Event, type SpreadSheet } from '@antv/s2';
import { ref, type ShallowRef, watch } from 'vue';

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
  });

  return { loading, setLoading };
};
