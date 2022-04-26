import type { BaseSheetComponentProps } from '@antv/s2-shared';
/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */
type IsEmitKey<T extends string> = T extends `on${string}` ? true : false;

type TransformEmitKey<T extends string> = T extends `on${infer C}${infer R}`
  ? `${Lowercase<C>}${R}`
  : never;

type GetPropKeys<T> = keyof {
  [K in keyof T as IsEmitKey<K & string> extends true ? never : K]: K;
};

type GetEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<K & string> extends true
    ? TransformEmitKey<K & string>
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
  [K in keyof BaseSheetComponentProps as IsEmitKey<K> extends true
    ? TransformEmitKey<K>
    : never]: BaseSheetComponentProps[K];
};
