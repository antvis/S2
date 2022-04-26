import type { SpreadSheet } from '@antv/s2';
import { ref } from 'vue';

export const useLoading = (s2: SpreadSheet, loadingProp = false) => {
  const loading = ref<boolean>(loadingProp);
  const setLoading = (updated: boolean) => {
    loading.value = updated;
  };
  return { loading, setLoading };
};
