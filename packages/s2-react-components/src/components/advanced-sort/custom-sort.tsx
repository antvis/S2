import {
  DownOutlined,
  UpOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { ADVANCED_SORT_PRE_CLS } from '@antv/s2';
import { Card } from 'antd';
import React from 'react';
import type { CustomSortProps } from './interface';

export const CustomSort: React.FC<CustomSortProps> = (props) => {
  const { splitOrders = [], setSplitOrders } = props;

  const upHandler = (value: string) => {
    const res = splitOrders.concat();

    res.splice(res.indexOf(value), 1);
    res.unshift(value);
    setSplitOrders(res);
  };

  const downHandler = (value: string) => {
    const res = splitOrders.concat();
    let index = res.indexOf(value);

    res.splice(res.indexOf(value), 1);
    res.splice((index += 1), 0, value);
    setSplitOrders(res);
  };

  const toTopHandler = (value: string) => {
    const res = splitOrders.concat();
    let index = res.indexOf(value);

    if (index > 0) {
      res.splice(res.indexOf(value), 1);
      res.splice((index -= 1), 0, value);
      setSplitOrders(res);
    }
  };

  const renderItem = (value: string) => (
    <>
      <span className="split-text">{value}</span>
      <span
        className={`${ADVANCED_SORT_PRE_CLS}-split-icon`}
        onClick={() => {
          upHandler(value);
        }}
      >
        <VerticalAlignTopOutlined />
      </span>
      <span
        className={`${ADVANCED_SORT_PRE_CLS}-split-icon`}
        onClick={() => {
          downHandler(value);
        }}
      >
        <DownOutlined />
      </span>
      <span
        className={`${ADVANCED_SORT_PRE_CLS}-split-icon`}
        onClick={() => {
          toTopHandler(value);
        }}
      >
        <UpOutlined />
      </span>
    </>
  );

  return (
    <Card className={`${ADVANCED_SORT_PRE_CLS}-card-content`}>
      {splitOrders.map((value) => (
        <li
          key={value}
          className={`${ADVANCED_SORT_PRE_CLS}-split-value`}
          title={value}
        >
          {renderItem(value)}
        </li>
      ))}
    </Card>
  );
};
