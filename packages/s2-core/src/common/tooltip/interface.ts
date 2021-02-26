/**
 * @Description:
 * @author qingsheng
 * @date 2019/3/11
 * @warning EVA 编码委员会提醒您：代码千万行，注释第一行；编程不规范，同事两行泪！
 */

import { IOperatorProps } from './components/operator';
import { BaseSpreadSheet } from '../../sheet-type';
import { SortParam } from '../interface';

export type DataItem = Record<string, any>;

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

  // 提供给外部任意传参数
  [key: string]: any;
}

export interface SummaryProps {
  readonly name: string;
  readonly value: number;
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
