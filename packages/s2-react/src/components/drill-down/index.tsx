import React, { type ReactNode, useEffect, useState } from 'react';
import { Button, ConfigProvider, Empty, Input, Menu } from 'antd';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { BaseDataSet, BaseDrillDownProps } from '@antv/s2-shared';
import { i18n } from '@antv/s2';
import {
  CalendarIcon,
  LocationIcon,
  SearchIcon,
  TextIcon,
} from '../icons/index';

import './index.less';

export interface DataSet extends BaseDataSet {
  icon?: React.ReactNode;
  name: string;
  value: string;
  type?: 'text' | 'location' | 'date';
  disabled?: boolean;
}

export interface DrillDownProps extends BaseDrillDownProps<DataSet> {
  extra?: ReactNode;
}

export const DrillDown: React.FC<DrillDownProps> = ({
  className,
  titleText = i18n('选择下钻维度'),
  clearButtonText = i18n('恢复默认'),
  searchText = i18n('搜索字段'),
  extra,
  drillFields,
  dataSet,
  disabledFields,
  getDrillFields,
  setDrillFields,
  ...restProps
}) => {
  const PRE_CLASS = 's2-drill-down';
  const DRILL_DOWN_ICON_MAP = {
    text: <TextIcon />,
    location: <LocationIcon />,
    date: <CalendarIcon />,
  };

  const getOptions = () => {
    return dataSet.map((val: DataSet) => {
      const item = val;
      item.disabled = !!(disabledFields && disabledFields.includes(item.value));
      return item;
    });
  };

  const [options, setOptions] = useState<DataSet[]>(getOptions());

  const handleSearch = (e: any) => {
    const { value } = e.target;

    if (!value) {
      setOptions([...dataSet]);
    } else {
      const reg = new RegExp(value, 'gi');
      const result = dataSet.filter((item) => reg.test(item.name));
      setOptions([...result]);
    }
  };

  const handleSelect = (value: any) => {
    const key = value?.selectedKeys;
    if (getDrillFields) {
      getDrillFields([...key]);
    }
    if (setDrillFields) setDrillFields([...key]);
  };

  const handleClear = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (getDrillFields) getDrillFields([]);
    if (setDrillFields) setDrillFields([]);
  };

  useEffect(() => {
    setOptions(getOptions());
  }, [disabledFields]);

  return (
    <ConfigProvider>
      <div className={cx(PRE_CLASS, className)} {...restProps}>
        <header className={`${PRE_CLASS}-header`}>
          <div>{titleText}</div>
          <Button
            type="link"
            disabled={isEmpty(drillFields)}
            onClick={handleClear}
          >
            {clearButtonText}
          </Button>
        </header>
        <Input
          className={`${PRE_CLASS}-search`}
          placeholder={searchText}
          onChange={handleSearch}
          onPressEnter={handleSearch}
          prefix={<SearchIcon />}
          allowClear
        />
        {isEmpty(options) && (
          <Empty
            imageStyle={{ height: '64px' }}
            className={`${PRE_CLASS}-empty`}
          />
        )}
        {extra}
        <Menu
          className={`${PRE_CLASS}-menu`}
          selectedKeys={drillFields}
          onSelect={handleSelect}
        >
          {options.map((option) => (
            <Menu.Item
              key={option.value}
              disabled={option.disabled}
              className={`${PRE_CLASS}-menu-item`}
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
