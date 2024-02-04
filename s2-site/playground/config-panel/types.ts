export type AttributeTreeProps<
  C extends Partial<AttributeComponentProps> = AttributeComponentProps,
> = {
  // 配置端当前配置的所有属性
  attributes: any;
  relations: {
    fromAttributeId: string;
    toAttributeId: string;
    action: string;
    value: string | Array<any> | boolean;
    operator: string;
  }[];
  config: AttributeComponentProps & C;
  disable?: boolean;
  onChange: (attrs: object) => void;
};

export type AttributeComponentProps = {
  type: string;
  // 属性组件 展示名
  displayName?: string;
  // 属性组件 id
  attributeId: string;
  children: AttributeComponentProps[];
  // 组件相关的一些配置
  [k: string]: any;
};
