import {
  PivotSheet,
  TableSheet,
  type S2Constructor,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import { onBeforeUnmount, onMounted, ref, shallowRef, toRaw } from 'vue';
import type { BaseSheetInitEmits, EmitFn } from '../interface';
import type { BaseSheetProps } from '../utils/initPropAndEmits';
import { usePagination } from './usePagination';
import { useEvents } from './useEvents';
import { useLoading } from './useLoading';
import { useSheetUpdate } from './useSheetUpdate';
import { useResize } from './useResize';

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
  const wrapperRef = ref<HTMLDivElement>();
  const containerRef = ref<HTMLDivElement>();

  const s2Ref = shallowRef<SpreadSheet>();

  const { loading, setLoading } = useLoading(s2Ref, loadingProps);
  const pagination = usePagination(s2Ref, props);

  // TODO: 如果onSpreadsheet属性变更了怎么办？？？
  const renderSpreadSheet = (container: HTMLDivElement) => {
    const rawDataCfg = toRaw(dataCfg!);
    const rawOptions = toRaw(options);

    const s2Options = getBaseSheetComponentOptions(rawOptions as S2Options);
    const s2Constructor: S2Constructor = [container, rawDataCfg, s2Options];
    if (onSpreadsheet) {
      return onSpreadsheet(...s2Constructor);
    }
    if (sheetType === 'table') {
      return new TableSheet(container, rawDataCfg, s2Options);
    }
    return new PivotSheet(container, rawDataCfg, s2Options);
  };

  const buildSpreadSheet = () => {
    setLoading(true);
    s2Ref.value = renderSpreadSheet(containerRef.value!);
    s2Ref.value.setThemeCfg(toRaw(themeCfg));
    s2Ref.value.render();
    setLoading(false);
    onGetSpreadSheet?.(s2Ref.value);
  };

  onMounted(buildSpreadSheet);
  useEvents(s2Ref, emit);
  useSheetUpdate(s2Ref, props);
  useResize(s2Ref, props, { wrapperRef, containerRef });

  onBeforeUnmount(() => {
    s2Ref.value?.destroy();
  });

  return {
    wrapperRef,
    containerRef,
    s2Ref,
    loading,
    setLoading,
    pagination,
  };
}
