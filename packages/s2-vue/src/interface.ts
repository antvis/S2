import type { BaseSheetComponentProps } from '@antv/s2-shared';
/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */
type IsEmitKey<Type> = Exclude<Type, undefined> extends (...args: any) => any
  ? true
  : false;

type TransformEmitKey<T> = T extends `on${infer C}${infer R}`
  ? `${Lowercase<C>}${R}`
  : T;

type GetPropKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true ? never : K]: K;
};
type GetEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? TransformEmitKey<K>
    : never]: K;
};
type GetInitPropKeys<T> = GetPropKeys<T>[];
type GetInitEmitKeys<T> = GetEmitKeys<T>[];

/* -------------------------------------------------------------------------- */
/*                                    组件类型                                    */
/* -------------------------------------------------------------------------- */

export type BaseSheetInitPropKeys = GetInitPropKeys<BaseSheetComponentProps>;
export type BaseSheetInitEmitKeys = GetInitEmitKeys<BaseSheetComponentProps>;

export type BaseSheetComponentEmits = {
  [K in keyof BaseSheetComponentProps as IsEmitKey<
    BaseSheetComponentProps[K]
  > extends true
    ? TransformEmitKey<K>
    : never]: BaseSheetComponentProps[K];
};
