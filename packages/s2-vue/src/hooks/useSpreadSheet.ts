import {
  PivotSheet,
  TableSheet,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import { onBeforeUnmount, onMounted, ref, shallowRef, toRaw } from 'vue';
import type { BaseSheetInitEmits, EmitFn } from '../interface';
import type { BaseSheetProps } from '../utils/initPropAndEmits';
import { getSheetComponentOptions } from '../utils/options';
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
    spreadsheet: customSpreadSheet,
    onMounted: onS2Mounted,
  } = props;
  const wrapperRef = ref<HTMLDivElement>();
  const containerRef = ref<HTMLDivElement>();

  const s2Ref = shallowRef<SpreadSheet>();

  const { loading, setLoading } = useLoading(s2Ref, loadingProps);
  const pagination = usePagination(s2Ref, props);

  const renderSpreadSheet = (container: HTMLDivElement) => {
    const rawDataCfg = toRaw(dataCfg!);
    const rawOptions = toRaw(options);

    const s2Options = getSheetComponentOptions(rawOptions as S2Options);

    if (customSpreadSheet) {
      return customSpreadSheet(container, rawDataCfg, s2Options);
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
    onS2Mounted?.(s2Ref.value);
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
