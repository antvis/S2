import type {
  TooltipOperatorProps as BaseTooltipOperatorProps,
  S2CellType,
  TooltipOperatorMenuItem as S2TooltipOperatorMenuItem,
  TooltipOperatorMenuOptions as S2TooltipOperatorMenuOptions,
  TooltipOperatorOptions as S2TooltipOperatorOptions,
  TooltipShowOptions,
} from '@antv/s2';

export interface TooltipOperatorMenuInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export type TooltipOperatorMenuItem = S2TooltipOperatorMenuItem<
  React.ReactNode,
  React.ReactNode
> & {
  [key: string]: unknown;
};

export type TooltipOperatorMenuItems = TooltipOperatorMenuItem[];

/**
 * 菜单项配置, 透传 Ant Design Menu API
 * https://ant-design.antgroup.com/components/menu-cn#api
 */
export type TooltipOperatorMenuOptions = S2TooltipOperatorMenuOptions<
  React.ReactNode,
  React.ReactNode
> & {
  items?: TooltipOperatorMenuItems;
  onClick?: (info: TooltipOperatorMenuInfo, cell: S2CellType) => void;

  /**
   * 指定菜单 UI组件, 如: Ant Design Menu https://ant-design.antgroup.com/components/menu-cn#api
   * @tips s2-react 层只提供单元格信息的注入和转换, 由上层业务指定渲染组件, 不依赖 antd , 从而达到解耦的目的.
   */
  render?: (props: Record<string, any>) => React.ReactNode;
};

export interface TooltipOperatorProps
  extends BaseTooltipOperatorProps<TooltipOperatorMenuOptions> {
  menu: TooltipOperatorMenuOptions;
}

export type TooltipOperatorOptions =
  S2TooltipOperatorOptions<TooltipOperatorMenuOptions>;

export interface TooltipRenderProps<
  T = React.ReactNode,
  Menu = TooltipOperatorMenuOptions,
> extends TooltipShowOptions<T, Menu> {
  readonly content?: T;
  readonly cell?: S2CellType | null;
  readonly onMounted?: () => void;
}

export type TooltipInfosProps = {
  infos: string;
};

export type TooltipIconProps = {
  icon: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
};
