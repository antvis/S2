import type { S2Options, SpreadSheet } from '@antv/s2';
import { reactive, watch, type ShallowRef } from 'vue';
import type { BaseSheetProps } from '../utils/initPropAndEmits';
import { traverse } from '../utils/traverse';

// props会将所有属性用shallowReactive包裹起来：
// 1. 如果是对dataCfg或者options直接替换， 那么只需要简单的通过 ()=>props.dataCfg 这种getter就能监听到
// 2. 如果 dataCfg任然是 reactive 数据，那么就存在直接修改了其中某一个属性的情况，这个时候就需要对所有的属性遍历来关联watch属性
// ? 如果数量特别多时，遍历可能存在性能问题，先暂时观察一下
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
    () => traverse(props.options),
    (options, prevOptions) => {
      updateFlag.rerender = true;

      if (!Object.is(prevOptions?.hierarchyType, options?.hierarchyType)) {
        // 自定义树目录需要重新构建 CustomTreePivotDataSet
        updateFlag.reloadData = true;
        updateFlag.rebuildDataset = true;
      }
      s2Ref.value?.setOptions(options as S2Options);
      s2Ref.value?.changeSheetSize(options.width, options.height);
    },
    { deep: true },
  );

  watch(
    () => traverse(props.dataCfg!),
    (dataCfg) => {
      updateFlag.rerender = true;
      updateFlag.reloadData = true;
      s2Ref.value?.setDataCfg(dataCfg);
    },
    { deep: true },
  );

  watch(
    () => traverse(props.themeCfg!),
    (themeCfg) => {
      updateFlag.rerender = true;
      s2Ref.value?.setThemeCfg(themeCfg);
    },
    {
      deep: true,
    },
  );

  watch(updateFlag, (flag) => {
    if (!flag.rerender) {
      return;
    }
    s2Ref.value?.render(flag.reloadData, flag.rebuildDataset);
    flag.rerender = false;
    flag.reloadData = false;
    flag.rebuildDataset = false;
  });
};
