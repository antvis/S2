import { S2Event, type SpreadSheet } from '@antv/s2';
import { ref, watch, type Ref, type ShallowRef } from 'vue';

export const useLoading = (
  s2Ref: ShallowRef<SpreadSheet | undefined>,
  loadingProp: Ref<boolean | undefined>,
) => {
  const loading = ref<boolean>(loadingProp.value ?? false);
  const setLoading = (updated: boolean) => {
    loading.value = updated;
  };

  // 监听外部传入的 loading prop 变化
  watch(loadingProp, (newLoading) => {
    loading.value = newLoading ?? false;
  });

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
