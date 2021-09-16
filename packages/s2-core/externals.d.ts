import 'jest-extended';

declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare module '*.svg' {
  const content: string;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

/**
 * 根据 Typescript 4.3 的 Tuple 和 Template 类型增强特性重定义 lodash.get 方法
 * 可以解决 _.get(obj,"str.str.str") 这种情况下，lodash 将第二个参数只能识别为 any, 无法做类型检测
 *
 * 举例说明：
 * interface P {
 *   name: string;
 *   address: {
 *     city: string;
 *  }[];
 * }
 *
 * _.get(p,"address.0.city") 可以将 "address.0.city" 推断为 ”address.${number}.city"类型，且 defaultValue 为 string
 */

declare module 'lodash' {
  // 将所有可能的路径转变为 Tuple
  // 还是以上面 P 类型为例
  // 最终转换结果是： ["name"] | ["address"] | ["address", number] | ["address", number, "city"]
  type AllTuplePaths<T> = T extends (infer Item)[]
    ? [number] | [number, ...AllTuplePaths<Item>]
    : T extends Record<string, any>
    ? [keyof T] | { [K in keyof T]: [K, ...AllTuplePaths<T[K]>] }[keyof T]
    : [];

  // 将所有可能 Tuple 转变为 Template String
  // 还是以上面 P 类型为例
  // 最终转换结果是： "name"|"address" | "address.${number}" | "address.${number}.city"
  type TupleToString<Tuple extends unknown[]> = Tuple extends [infer Single]
    ? Single extends string | number
      ? `${Single}`
      : never
    : Tuple extends [infer First, ...infer Rest]
    ? First extends string | number
      ? `${First}.${TupleToString<Rest>}`
      : never
    : never;

  type AllPaths<T> = TupleToString<AllTuplePaths<T>>;

  // 获取当前路径对应的属性类型
  type MatchPathType<
    TObject extends Record<string, any>,
    TPath extends string,
  > = TObject extends (infer Item)[]
    ? TPath extends `${number}.${infer Rest}`
      ? Rest extends AllPaths<TObject[number]>
        ? MatchPathType<TObject[number], Rest>
        : never
      : Item
    : TPath extends keyof TObject
    ? TObject[TPath]
    : TPath extends `${infer First}.${infer Rest}`
    ? First extends keyof TObject
      ? Rest extends AllPaths<TObject[First]>
        ? MatchPathType<TObject[First], Rest>
        : never
      : never
    : never;

  // 获取所有合法的字段集合
  type ValidPath<T> = T extends unknown[]
    ? number
    : keyof T & (string | number);

  // 将 Path 从 string 类型转变为 template string 类型
  type PathOf<
    TObject extends Record<string, any>,
    TPath extends string,
    Current extends string = '',
  > = TObject extends unknown[]
    ? TPath extends `${number}.${infer R}`
      ? PathOf<TObject[number], R, `${Current}${number}.`>
      : TPath extends `${number}`
      ? `${Current}${number}`
      : `${Current}${ValidPath<TObject>}`
    : TPath extends `${infer F}.${infer R}`
    ? F extends keyof TObject
      ? PathOf<TObject[F], R, `${Current}${F}.`>
      : `${Current}${ValidPath<TObject>}`
    : TPath extends keyof TObject
    ? `${Current}${TPath}`
    : `${Current}${ValidPath<TObject>}`;

  interface LoDashStatic {
    // 自定义 get 类型声明
    get<TObject extends Record<string, any>, TPath extends string>(
      object: TObject,
      path: PathOf<TObject, TPath>,
      defaultValue?: MatchPathType<TObject, TPath>,
    ): MatchPathType<TObject, TPath>;
  }
}
