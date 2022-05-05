import type { SpreadSheet } from '@antv/s2';
import { isArray, isMap, isObject, isPlainObject, isSet } from 'lodash';
import { isProxy, isRef, reactive, watch, type ShallowRef } from 'vue';
import type { BaseSheetProps } from '../utils/initPropAndEmits';

// 属性遍历工具函数
const traverse = <T>(value: T, seen?: Set<T>) => {
  // eslint-disable-next-line dot-notation
  if (!isObject(value) || (value as any)['__v_skip']) {
    return value;
  }

  if (!isProxy(value) && !isRef(value)) {
    return value;
  }

  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value as any) {
      traverse((value as any)[key], seen);
    }
  }
  return value;
};

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
      s2Ref.value?.setOptions(options);
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
    () => {
      return traverse(props.themeCfg!);
    },
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
