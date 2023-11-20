import type {
  S2CellType,
  TooltipOperatorMenuItem as S2TooltipOperatorMenuItem,
  TooltipOperatorMenuOptions as S2TooltipOperatorMenuOptions,
  TooltipShowOptions,
  TooltipOperatorOptions as S2TooltipOperatorOptions,
} from '@antv/s2';
import type { TooltipOperatorProps as BaseTooltipOperatorProps } from '@antv/s2-shared';
import { type MenuProps } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';

export interface TooltipOperatorMenuInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export type TooltipOperatorMenuItem = Omit<ItemType, 'icon' | 'label'> &
  S2TooltipOperatorMenuItem<React.ReactNode, React.ReactNode>;

export type TooltipOperatorMenuItems = TooltipOperatorMenuItem[];

/**
 * 菜单项配置, 透传 Ant Design Menu API
 * https://ant-design.antgroup.com/components/menu-cn#api
 */
export type TooltipOperatorMenuOptions = S2TooltipOperatorMenuOptions<
  React.ReactNode,
  React.ReactNode
> &
  Omit<MenuProps, 'onClick' | 'items'> & {
    items?: TooltipOperatorMenuItems;
    onClick?: (info: TooltipOperatorMenuInfo, cell: S2CellType) => void;
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
