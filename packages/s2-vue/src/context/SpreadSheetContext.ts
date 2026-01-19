import type { SpreadSheet } from '@antv/s2';
import type { InjectionKey, Ref } from 'vue';
import { inject, provide, shallowRef } from 'vue';

/**
 * S2 实例的 InjectionKey
 */
export const S2_INSTANCE_KEY: InjectionKey<Ref<SpreadSheet | null>> =
  Symbol('s2-instance');

/**
 * 提供 S2 实例给子组件
 * @param instance S2 实例的响应式引用
 */
export function provideSpreadSheet(instance: Ref<SpreadSheet | null>) {
  provide(S2_INSTANCE_KEY, instance);
}

/**
 * 在子组件中获取 S2 实例
 * 类似 React 版本的 useSpreadSheetInstance()
 * @returns S2 实例的响应式引用
 */
export function useSpreadSheetInstance(): Ref<SpreadSheet | null> {
  const instance = inject(S2_INSTANCE_KEY, shallowRef(null));

  return instance;
}
