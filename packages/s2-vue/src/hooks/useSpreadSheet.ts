import {
  PivotSheet,
  TableSheet,
  type S2Constructor,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { BaseSheetInitEmits, EmitFn } from '../interface';
import type { BaseSheetProps } from '../utils/initPropAndEmits';
import { useEvents } from './useEvents';
import { useLoading } from './useLoading';

export function useSpreadSheet(
  props: BaseSheetProps,
  emit: EmitFn<BaseSheetInitEmits>,
) {
  const {
    dataCfg,
    options,
    themeCfg,
    loading: loadingProps,
    sheetType,
    onSpreadsheet,
    onGetSpreadSheet,
  } = props;
  const wrapRef = ref<HTMLDivElement>();
  const containerRef = ref<HTMLDivElement>();
  const s2Ref = ref<SpreadSheet>();

  const { loading, setLoading } = useLoading(s2Ref.value!, loadingProps);

  // TODO: 如果onSpreadsheet属性变更了怎么办？？？
  const renderSpreadSheet = (container: HTMLDivElement) => {
    const s2Options = getBaseSheetComponentOptions(options as S2Options);
    const s2Constructor: S2Constructor = [container, dataCfg!, s2Options];
    if (onSpreadsheet) {
      return onSpreadsheet(...s2Constructor);
    }
    if (sheetType === 'table') {
      return new TableSheet(container, dataCfg!, s2Options);
    }
    return new PivotSheet(container, dataCfg!, s2Options);
  };

  const buildSpreadSheet = () => {
    setLoading(true);
    s2Ref.value = renderSpreadSheet(containerRef.value!);
    s2Ref.value.setThemeCfg(themeCfg);
    s2Ref.value.render();
    setLoading(false);
    onGetSpreadSheet?.(s2Ref.value);
  };

  onMounted(buildSpreadSheet);
  onMounted(() => {
    useEvents(s2Ref, emit);
  });

  onBeforeUnmount(() => {
    s2Ref.value?.destroy();
  });

  return {
    wrapRef,
    containerRef,
    s2Ref,
    loading,
    setLoading,
  };
}
