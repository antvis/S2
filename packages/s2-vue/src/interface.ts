import type { BaseSheetComponentProps } from '@antv/s2-shared';
/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */
type IsEmitKey<T extends string> = T extends `on${string}` ? true : false;

type GetPropKeys<T> = keyof {
  [K in keyof T as IsEmitKey<K & string> extends true ? never : K]: K;
};

type GetEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<K & string> extends true ? K : never]: K;
};

type GetInitPropKeys<T> = GetPropKeys<T>[];

/* -------------------------------------------------------------------------- */
/*                                    组件类型                                    */
/* -------------------------------------------------------------------------- */

export type BaseSheetInitPropKeys = GetInitPropKeys<BaseSheetComponentProps>;
