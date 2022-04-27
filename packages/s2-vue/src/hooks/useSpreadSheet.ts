import {
  PivotSheet,
  TableSheet,
  type S2Constructor,
  type S2Options,
  type SpreadSheet,
} from '@antv/s2';
import {
  type BaseSheetComponentProps,
  getBaseSheetComponentOptions,
} from '@antv/s2-shared';
import { onMounted, ref } from 'vue';
import { useLoading } from './useLoading';

export function useSpreadSheet(props: BaseSheetComponentProps) {
  const {
    spreadsheet: customSpreadSheet,
    dataCfg,
    options,
    themeCfg,
    loading: loadingProps,
    getSpreadSheet,
    sheetType,
  } = props;
  const wrapRef = ref<HTMLDivElement>();
  const containerRef = ref<HTMLDivElement>();
  const s2Ref = ref<SpreadSheet>();

  const { loading, setLoading } = useLoading(s2Ref.value!, loadingProps);

  const renderSpreadSheet = (container: HTMLDivElement) => {
    const s2Options = getBaseSheetComponentOptions(options as S2Options);
    const s2Constructor: S2Constructor = [container, dataCfg, s2Options];
    if (customSpreadSheet) {
      return customSpreadSheet(...s2Constructor);
    }
    if (sheetType === 'table') {
      return new TableSheet(container, dataCfg, s2Options);
    }
    return new PivotSheet(container, dataCfg, s2Options);
  };

  const buildSpreadSheet = () => {
    setLoading(true);
    s2Ref.value = renderSpreadSheet(containerRef.value!);
    s2Ref.value.setThemeCfg(themeCfg);
    s2Ref.value.render();
    setLoading(false);
    getSpreadSheet?.(s2Ref.value);
  };

  onMounted(buildSpreadSheet);

  return {
    wrapRef,
    containerRef,
    s2Ref,
    loading,
    setLoading,
  };
}
