import type { BaseSheetComponentProps } from '@antv/s2-shared';
import type { ComponentObjectPropsOptions, PropType } from 'vue';

// 这个是vue中的类型，但是vue没有export
// reference: @vue/runtime-core/dist/runtime-core.d.ts L1351
interface PropOptions<T = any> {
  type?: PropType<T>;
  required?: boolean;
  default?: T;
  validator?(value: unknown): boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */
type IsEmitKey<Type> = Exclude<Type, undefined> extends (...args: any) => any
  ? true
  : false;

type TransformEmitKey<T> = T extends `on${infer R}` ? Uncapitalize<R> : T;

type GetPropKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true ? never : K]: K;
};
type GetEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? TransformEmitKey<K>
    : never]: K;
};

type GetInitProps<T> = {
  [K in keyof T as IsEmitKey<T[K]> extends true ? never : K]-?: PropOptions<
    NonNullable<T[K]>
  >;
};

type GetInitEmits<T> = {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? TransformEmitKey<K>
    : never]-?: T[K];
};
/* -------------------------------------------------------------------------- */
/*                                    组件类型                                    */
/* -------------------------------------------------------------------------- */

export type BaseSheetInitPropKeys = GetPropKeys<BaseSheetComponentProps>;
export type BaseSheetInitEmitKeys = GetEmitKeys<BaseSheetComponentProps>;
export type BaseSheetInitProps = GetInitProps<BaseSheetComponentProps>;
export type BaseSheetInitEmits = GetInitEmits<BaseSheetComponentProps>;
