import { ref } from 'vue';

export const useLoading = (loadingProp = false) => {
  const loading = ref<boolean>(loadingProp);
  const setLoading = (updated: boolean) => {
    loading.value = updated;
  };
  return { loading, setLoading };
};
