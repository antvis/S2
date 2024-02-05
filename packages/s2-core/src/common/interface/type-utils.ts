export type PickEssential<O> = {
  [K in keyof O as Pick<Partial<O>, K> extends Pick<O, K> ? never : K]: O[K];
};

export type DeepRequired<T extends Record<string, any>> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Record<string, any>
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};
