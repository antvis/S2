import { SearchOutlined } from '@ant-design/icons';
import { DRILL_DOWN_PRE_CLASS, i18n } from '@antv/s2';
import { Button, Empty, Input, Menu, type MenuProps } from 'antd';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';
import { CalendarIcon, LocationIcon, TextIcon } from '../common/icons';

import type { DrillDownDataSet, DrillDownProps } from './interface';

import './index.less';

export const DrillDown: React.FC<DrillDownProps> = React.memo(
  ({
    className,
    title = i18n('选择下钻维度'),
    clearText = i18n('恢复默认'),
    searchText = i18n('搜索字段'),
    extra,
    drillFields = [],
    dataSet = [],
    disabledFields,
    getDrillFields,
    setDrillFields,
    renderMenu,
    ...restProps
  }) => {
    const DRILL_DOWN_ICON_MAP = {
      text: <TextIcon />,
      location: <LocationIcon />,
      date: <CalendarIcon />,
    };

    const getOptions = () =>
      dataSet.map((item: DrillDownDataSet) => {
        item.disabled = !!(
          disabledFields && disabledFields.includes(item.value)
        );

        return item;
      });

    const [options, setOptions] =
      React.useState<DrillDownDataSet[]>(getOptions());

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

    React.useEffect(() => {
      setOptions(getOptions());
    }, [disabledFields]);

    const menuItems: MenuProps['items'] = options.map((option) => {
      return {
        key: option.value,
        label: option.name,
        disabled: option.disabled,
        className: `${DRILL_DOWN_PRE_CLASS}-menu-item`,
        icon: option.icon ? option.icon : DRILL_DOWN_ICON_MAP[option.type!],
      };
    });

    const menuProps: MenuProps = {
      className: `${DRILL_DOWN_PRE_CLASS}-menu`,
      selectedKeys: drillFields || [],
      onSelect: handleSelect,
      items: menuItems,
    };

    return (
      <div className={cx(DRILL_DOWN_PRE_CLASS, className)} {...restProps}>
        <header className={`${DRILL_DOWN_PRE_CLASS}-header`}>
          <div className={`${DRILL_DOWN_PRE_CLASS}-header-title`}>{title}</div>
          <Button
            type="link"
            disabled={isEmpty(drillFields)}
            onClick={handleClear}
          >
            {clearText}
          </Button>
        </header>
        <Input
          className={`${DRILL_DOWN_PRE_CLASS}-search`}
          placeholder={searchText}
          onChange={handleSearch}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined />}
          allowClear
        />
        {isEmpty(options) && (
          <Empty
            imageStyle={{ height: '64px' }}
            className={`${DRILL_DOWN_PRE_CLASS}-empty`}
          />
        )}
        {extra}
        {renderMenu?.(menuProps) ?? <Menu {...menuProps} />}
      </div>
    );
  },
);

DrillDown.displayName = 'DrillDown';
