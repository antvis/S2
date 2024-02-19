import { i18n } from '@antv/s2';
import type { BaseDataSet, BaseDrillDownComponentProps } from '@antv/s2-shared';
import { DRILL_DOWN_PRE_CLASS } from '@antv/s2-shared';
import { Button, Empty, Input, Menu, type MenuProps } from 'antd';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useState, type ReactNode } from 'react';
import {
  CalendarIcon,
  LocationIcon,
  SearchIcon,
  TextIcon,
} from '../icons/index';

import '@antv/s2-shared/src/styles/drill-down.less';

export interface DrillDownDataSet extends BaseDataSet {
  icon?: React.ReactNode;
}

export interface DrillDownProps
  extends BaseDrillDownComponentProps<DrillDownDataSet> {
  extra?: ReactNode;
}

export const DrillDown: React.FC<DrillDownProps> = React.memo(
  ({
    className,
    titleText = i18n('选择下钻维度'),
    clearButtonText = i18n('恢复默认'),
    searchText = i18n('搜索字段'),
    extra,
    drillFields,
    dataSet = [],
    disabledFields,
    getDrillFields,
    setDrillFields,
    ...restProps
  }) => {
    const DRILL_DOWN_ICON_MAP = {
      text: <TextIcon />,
      location: <LocationIcon />,
      date: <CalendarIcon />,
    };

    const getOptions = () =>
      dataSet.map((val: DrillDownDataSet) => {
        val.disabled = !!(disabledFields && disabledFields.includes(val.value));

        return val;
      });

    const [options, setOptions] = useState<DrillDownDataSet[]>(getOptions());

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

      if (setDrillFields) {
        setDrillFields([...key]);
      }
    };

    const handleClear = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (getDrillFields) {
        getDrillFields([]);
      }

      if (setDrillFields) {
        setDrillFields([]);
      }
    };

    useEffect(() => {
      setOptions(getOptions());
    }, [disabledFields]);

    const menusItems: MenuProps['items'] = options.map((option) => {
      return {
        key: option.value,
        label: option.name,
        disabled: option.disabled,
        className: `${DRILL_DOWN_PRE_CLASS}-menu-item`,
        icon: option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type!],
      };
    });

    return (
      <div className={cx(DRILL_DOWN_PRE_CLASS, className)} {...restProps}>
        <header className={`${DRILL_DOWN_PRE_CLASS}-header`}>
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
          className={`${DRILL_DOWN_PRE_CLASS}-search`}
          placeholder={searchText}
          onChange={handleSearch}
          onPressEnter={handleSearch}
          prefix={<SearchIcon />}
          allowClear
        />
        <div className={`${DRILL_DOWN_PRE_CLASS}-extra`}>{extra}</div>
        {isEmpty(options) && (
          <Empty
            imageStyle={{ height: '64px' }}
            className={`${DRILL_DOWN_PRE_CLASS}-empty`}
          />
        )}
        <Menu
          className={`${DRILL_DOWN_PRE_CLASS}-menu`}
          selectedKeys={drillFields}
          onSelect={handleSelect}
          items={menusItems}
        />
      </div>
    );
  },
);

DrillDown.displayName = 'DrillDown';
