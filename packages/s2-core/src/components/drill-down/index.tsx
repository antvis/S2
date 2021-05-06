import React, { useState, useEffect } from 'react';
import { ConfigProvider, Menu, Button, Input, Empty } from 'antd';
import classNames from 'classnames';
import zhCN from 'antd/lib/locale/zh_CN';
import {
  CalendarIcon,
  TextIcon,
  LocationIcon,
  SearchIcon,
} from '../icons/index';
import { isEmpty } from 'lodash';

import './index.less';
export interface DataSet {
  icon?: React.ReactNode;
  name: string;
  value: string;
  type?: 'text' | 'location' | 'date';
  disabled?: boolean;
}

export interface DrillDownProps {
  className?: string;
  titleText?: string;
  searchText?: string;
  clearButtonText?: string;
  dataSet: DataSet[];
  drillFields?: string[];
  disabledFields?: string[];
  getDrillFields?: (drillFields: string[]) => void;
  setDrillFields?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DrillDown: React.FC<DrillDownProps> = ({
  className,
  titleText = '选择下钻维度',
  clearButtonText = '恢复默认',
  searchText = '搜索字段',
  drillFields,
  dataSet,
  disabledFields,
  getDrillFields,
  setDrillFields,
  ...restProps
}) => {
  const PRECLASS = 'ss-drill-down';
  const DRILL_DOWN_ICON_MAP = {
    text: <TextIcon />,
    location: <LocationIcon />,
    date: <CalendarIcon />,
  };

  const getOptions = () => {
    const res = dataSet.map((val: DataSet) => {
      const item = val;
      if (disabledFields && disabledFields.includes(item.value)) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      return item;
    });
    return res;
  };

  const [options, setOptions] = useState<DataSet[]>(getOptions());

  const handelSearch = (e: any) => {
    const { value } = e.target;

    if (!value) {
      setOptions([...dataSet]);
    } else {
      const reg = new RegExp(value, 'gi');
      const result = dataSet.filter((item) => reg.test(item.name));
      setOptions([...result]);
    }
  };

  const handelSelect = (vaule: any) => {
    const key = vaule?.selectedKeys;
    if (getDrillFields) {
      getDrillFields([...key]);
    }
    if (setDrillFields) setDrillFields([...key]);
  };

  const handelClear = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (getDrillFields) getDrillFields([]);
    if (setDrillFields) setDrillFields([]);
  };

  useEffect(() => {
    setOptions(getOptions());
  }, [disabledFields]);

  return (
    <ConfigProvider locale={zhCN}>
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
          prefix={<SearchIcon />}
          allowClear
        />
        {isEmpty(options) && (
          <Empty
            imageStyle={{ height: '64px' }}
            className={`${PRECLASS}-empty`}
          />
        )}
        <Menu
          className={`${PRECLASS}-menu`}
          selectedKeys={drillFields}
          onSelect={handelSelect}
        >
          {options.map((option) => (
            <Menu.Item
              key={option.value}
              disabled={option.disabled}
              className={`${PRECLASS}-menu-item`}
              icon={
                option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type]
              }
            >
              {option.name}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </ConfigProvider>
  );
};
