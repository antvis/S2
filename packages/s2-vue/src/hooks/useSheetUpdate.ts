import type { S2Options, SpreadSheet } from '@antv/s2';
import { reactive, watch, type ShallowRef, isProxy } from 'vue';
import type { BaseSheetProps } from '../utils/initPropAndEmits';

/**
 * props 会将所有属性用 shallowReactive 包裹起来：
 * 1. 如果是对 dataCfg 或者 options 直接替换， 那么只需要简单的通过 ()=> props.dataCfg 这种 getter 就能监听到
 * 2. 如果 dataCfg 任然是 reactive 数据，那么就存在直接修改了其中某一个属性的情况，这个时候就需要对所有的属性遍历来关联 watch 属性
 * ? 如果数量特别多时，遍历可能存在性能问题，先暂时观察一下
 */
export const useSheetUpdate = (
  s2Ref: ShallowRef<SpreadSheet | undefined>,
  props: BaseSheetProps,
) => {
  const updateFlag = reactive({
    rerender: false,
    reloadData: false,
    rebuildDataset: false,
  });

  watch(
    () => props.options,
    (options, prevOptions) => {
      updateFlag.rerender = true;

      if (!Object.is(prevOptions?.hierarchyType, options?.hierarchyType)) {
        // 自定义树目录需要重新构建 CustomTreePivotDataSet
        updateFlag.reloadData = true;
        updateFlag.rebuildDataset = true;
      }

      s2Ref.value?.setOptions(options as S2Options);
      s2Ref.value?.changeSheetSize(options?.width, options?.height);
    },
    { deep: isProxy(props.options) },
  );

  watch(
    () => props.dataCfg!,
    (dataCfg, prevDataCfg) => {
      if (
        prevDataCfg?.fields?.columns?.length !==
        dataCfg?.fields?.columns?.length
      ) {
        s2Ref.value?.facet.clearInitColLeafNodes();
      }

      updateFlag.rerender = true;
      updateFlag.reloadData = true;
      s2Ref.value?.setDataCfg(dataCfg);
    },
    { deep: isProxy(props.dataCfg) },
  );

  watch(
    () => props.themeCfg!,
    (themeCfg) => {
      updateFlag.rerender = true;
      s2Ref.value?.setThemeCfg(themeCfg);
    },
    {
      deep: isProxy(props.themeCfg),
    },
  );

  watch(updateFlag, (flag) => {
    if (!flag.rerender) {
      return;
    }

    s2Ref.value?.render({
      reloadData: flag.reloadData,
      reBuildDataSet: flag.rebuildDataset,
    });
    flag.rerender = false;
    flag.reloadData = false;
    flag.rebuildDataset = false;
  });
};
