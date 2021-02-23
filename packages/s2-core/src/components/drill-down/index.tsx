/**
 * Create By yingying
 * On 2020-12-15
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Button, Input, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { CalenderIcon, TextIcon, LocationIcon } from '../icons';
import { isEmpty } from 'lodash';
import './index.less';

export interface DataSet {
  icon?: React.ReactNode;
  name: string;
  value: string;
  type?: 'text' | 'location' | 'date';
}

export interface DrillDownProps {
  className?: string;
  titleText?: string;
  searchText?: string;
  clearButtonText?: string;
  dataSet?: DataSet[];
  drillFields?: string[];
  setDrillFields?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DrillDown: React.FC<DrillDownProps> = ({
  className,
  titleText = '选择下钻维度',
  clearButtonText = '恢复默认',
  searchText = '搜索字段',
  drillFields,
  dataSet,
  setDrillFields,
  ...restProps
}) => {
  const PRECLASS = 'sheet-drill-down';
  const DRILL_DOWN_ICON_MAP = {
    text: <TextIcon />,
    location: <LocationIcon />,
    date: <CalenderIcon />,
  };
  const [options, setOptions] = useState<DataSet[]>(dataSet);

  const handelSearch = (e: any) => {
    const { value } = e.target;
    const pattern = new RegExp(
      "[`~!@#$^&*=|{}';',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、?]",
    );
    let query = '';
    for (let i = 0; i < value.length; i += 1) {
      query += value.substr(i, 1).replace(pattern, '');
    }
    if (!query) {
      setOptions([...dataSet]);
    } else {
      const reg = new RegExp(query, 'gi');
      const result = dataSet.filter((item) => reg.test(item.name));
      setOptions([...result]);
    }
  };

  const handelSelect = (vaule: any) => {
    const key = vaule?.selectedKeys;
    setDrillFields(key);
  };

  const handelClear = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setDrillFields([]);
  };

  return (
    <div className={classNames(PRECLASS, className)} {...restProps}>
      <header className={`${PRECLASS}-header`}>
        <div>{titleText}</div>
        <Button
          type="link"
          disabled={isEmpty(drillFields)}
          onClick={handelClear}
        >
          {clearButtonText}
        </Button>
      </header>
      <Input
        className={`${PRECLASS}-search`}
        placeholder={searchText}
        onChange={handelSearch}
        onPressEnter={handelSearch}
        prefix={<SearchOutlined className="site-form-item-icon" />}
        allowClear
      />
      {isEmpty(options) && (
        <Empty
          imageStyle={{ height: '64px' }}
          className={`${PRECLASS}-empty`}
        />
      )}
      <Menu
        className={PRECLASS}
        selectedKeys={drillFields}
        onSelect={handelSelect}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            className={`${PRECLASS}-item`}
            icon={option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type]}
          >
            {option.name}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};
