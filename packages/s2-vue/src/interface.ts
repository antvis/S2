import type {
  BaseSheetComponentProps,
  BaseDrillDownComponentProps,
  PartDrillDown,
} from '@antv/s2-shared';
import type { PropType } from 'vue';
import type { PaginationProps } from 'ant-design-vue';
import type { UnionToIntersection } from '@vue/shared';
import type { TooltipContentType, S2Options, Pagination } from '@antv/s2';

/*
 * 这个是vue中的类型，但是vue没有export
 * reference: @vue/runtime-core/dist/runtime-core.d.ts L1351
 */
interface PropOption<T = any> {
  type: PropType<T>;
  default?: T;
}

interface RequiredPropOption<T = any> {
  type?: PropType<T>;
  required: true;
}

// reference: @vue/runtime-core/dist/runtime-core.d.ts L820
export type EmitFn<
  Options = Record<string, (...args: any[]) => any>,
  Event extends keyof Options = keyof Options,
> =
  Options extends Array<infer V>
    ? (event: V, ...args: any[]) => void
    : Record<string, any> extends Options
      ? (event: string, ...args: any[]) => void
      : UnionToIntersection<
          {
            [key in Event]: Options[key] extends (...args: infer Args) => any
              ? (event: key, ...args: Args) => void
              : (event: key, ...args: any[]) => void;
          }[Event]
        >;

/* -------------------------------------------------------------------------- */
/*                                   一些工具类型                                   */
/* -------------------------------------------------------------------------- */

type GetOptionalKeys<T> = keyof {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? never : K]: K;
};

type IsEmitKey<Type> =
  Exclude<Type, undefined> extends (...args: any) => any ? true : false;

type TransformEmitKey<T> = T extends `on${infer R}` ? Uncapitalize<R> : T;

type GetPropKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true ? never : K]: K;
};
type GetEmitKeys<T> = keyof {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? TransformEmitKey<K>
    : never]: K;
};

// 用于在defineComponent中进行props类型推断的工具方法
export type GetInitProps<T, OptionalKeys = GetOptionalKeys<T>> = {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? never
    : K]-?: K extends OptionalKeys
    ? PropOption<NonNullable<T[K]>>
    : RequiredPropOption<NonNullable<T[K]>>;
};

// 用于在defineComponent中进行emits类型推断的工具方法
type GetInitEmits<T> = {
  [K in keyof T as IsEmitKey<T[K]> extends true
    ? TransformEmitKey<K>
    : never]-?: T[K];
};

/* -------------------------------------------------------------------------- */
/*                                    组件类型                                    */
/* -------------------------------------------------------------------------- */

export type SheetComponentOptions = S2Options<
  TooltipContentType,
  Pagination & PaginationProps
>;
export type SheetComponentProps = BaseSheetComponentProps<
  PartDrillDown,
  unknown,
  SheetComponentOptions
>;
export type BaseSheetInitPropKeys = GetPropKeys<BaseSheetComponentProps>;
export type BaseSheetInitEmitKeys = GetEmitKeys<BaseSheetComponentProps>;
export type BaseSheetInitProps = GetInitProps<SheetComponentProps>;
export type BaseSheetInitEmits = GetInitEmits<BaseSheetComponentProps>;
export type BaseDrillDownProps = GetInitProps<BaseDrillDownComponentProps>;
export type BaseDrillDownEmitKeys = GetEmitKeys<BaseDrillDownComponentProps>;
export type BaseDrillDownEmits = GetInitEmits<BaseDrillDownComponentProps>;
