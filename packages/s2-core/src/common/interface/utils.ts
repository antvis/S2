export type PickEssential<O> = {
  [K in keyof O as Pick<Partial<O>, K> extends Pick<O, K> ? never : K]: O[K];
};
