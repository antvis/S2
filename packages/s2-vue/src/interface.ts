import type { BaseSheetComponentProps } from '@antv/s2-shared';
/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */
type IsEmitKey<T extends string> = T extends `on${string}` ? true : false;

type OmitEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<K & string> extends true ? never : K]: K;
};

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer R) => void
  ? R
  : never;

type LastUnion<T> = UnionToIntersection<
  T extends any ? (arg: T) => void : never
> extends (arg: infer R) => void
  ? R
  : never;

type UnionToTuple<T, R extends any[] = []> = [T] extends [never]
  ? R
  : UnionToTuple<Exclude<T, LastUnion<T>>, [LastUnion<T>, ...R]>;

type GetInitPropKeys<T> = UnionToTuple<OmitEmitKeys<T>>;

/* -------------------------------------------------------------------------- */
/*                                    组件类型                                    */
/* -------------------------------------------------------------------------- */

export type BaseSheetInitPropKeys = GetInitPropKeys<BaseSheetComponentProps>;
