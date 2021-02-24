/**
 * @Description:
 * @author qingsheng
 * @date 2019/3/11
 * @warning EVA 编码委员会提醒您：代码千万行，注释第一行；编程不规范，同事两行泪！
 */

import { BaseSpreadSheet } from '../../sheet-type';
import { SortParam } from '../interface';

export type DataItem = Record<string, any>;

export interface IMenu {
  readonly id: string; // 菜单的 id
  readonly icon?: any; // 菜单的 icon
  readonly text?: string; // 菜单的 文本
  readonly children?: IMenu[]; // 二级菜单，TODO 理论上支持无限嵌套，目前仅仅测试了二级菜单
}

export interface IOperatorProps {
  // 点击之后的回调
  readonly onClick: (...params) => void;
  readonly menus: IMenu[];
}

export interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly tipHeight?: number;
}

export type ListItem = {
  name: string;
  value: string;
  icon?: string;
};

export interface SortQuery {
  [key: string]: string;
}

export type ActionType =
  | 'cellSelection'
  | 'cellHover'
  | 'rowSelection'
  | 'columnSelection';

export interface TooltipOptions {
  actionType?: ActionType;
  // button action on the top
  operator?: IOperatorProps;
  enterable?: boolean;
  // totals or not
  isTotals?: boolean;
  singleTips?: boolean;

  interpretation?: InterpretationProps;

  // 提供给外部任意传参数
  [key: string]: any;
}

export interface SummaryProps {
  readonly name: string;
  readonly value: number | string;
  readonly selectedData: DataItem[];
}

export interface TipsProps {
  readonly tips: string;
}

export interface OperationProps {
  plot: BaseSpreadSheet;
  sortFieldId: string;
  sortQuery: SortQuery;
}

export interface OperationState {
  sortParam: SortParam;
}

export type DetailProps = {
  list: ListItem[];
};

export type InterpretationProps = {
  name: string;
  icon?: any;
  text?: string;
  render?: React.ElementType;
};

export type InfosProps = {
  infos: string;
};

export type ShowProps = {
  position: Position;
  data?: DataItem;
  options?: TooltipOptions;
  element?: React.ReactElement;
};

export type HeadInfo = {
  rows: ListItem[];
  cols: ListItem[];
};
