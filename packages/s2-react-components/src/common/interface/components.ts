export interface BaseComponentProps<T> {
  /**
   * 标题
   * @default "文字对齐"
   */
  title?: React.ReactNode;

  /**
   * 默认是否折叠
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * 默认配置
   */
  defaultOptions?: Partial<T>;

  /**
   * 子节点
   */
  children?: React.ReactNode;
}
