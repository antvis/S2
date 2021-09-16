import { Menu } from 'antd';
import { isEmpty, map, size } from 'lodash';
import React from 'react';
import {
  TooltipOperatorMenu,
  TooltipOperatorOptions,
} from '@/common/interface';
import { getIcon, HtmlIcon } from '@/common/icons';
import {
  DEFAULT_ICON_PROPS,
  TOOLTIP_PREFIX_CLS,
} from '@/common/constant/tooltip';
import './index.less';

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */

export const TooltipOperator = (props: TooltipOperatorOptions) => {
  const { menus, onClick } = props;

  const onMenuClick = (e) => {
    const { key, domEvent } = e;

    onClick(key, domEvent);
  };

  const renderIcon = (icon) => {
    if (getIcon(icon)) {
      return (
        <HtmlIcon
          className={`${TOOLTIP_PREFIX_CLS}-operator-icon`}
          type={icon}
          {...DEFAULT_ICON_PROPS}
        />
      );
    }

    const Component = icon;
    return (
      icon && (
        <Component
          className={`${TOOLTIP_PREFIX_CLS}-operator-icon`}
          {...DEFAULT_ICON_PROPS}
        />
      )
    );
  };

  const renderMenu = (menu: TooltipOperatorMenu) => {
    const { id, icon, text, children } = menu;

    if (size(children)) {
      const subMenuTitle = (
        <span>
          {renderIcon(icon)}
          {text}
        </span>
      );

      return (
        <Menu.SubMenu
          title={subMenuTitle}
          key={id}
          popupClassName={`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`}
        >
          {map(children, (m: TooltipOperatorMenu) => renderMenu(m))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={id}>
        {renderIcon(icon)}
        {text}
      </Menu.Item>
    );
  };

  const renderMenus = () => {
    return (
      <Menu
        className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
        id={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
        onClick={onMenuClick}
        mode="horizontal"
      >
        {map(menus, (menu: TooltipOperatorMenu) => renderMenu(menu))}
      </Menu>
    );
  };

  return (
    !isEmpty(menus) && (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    )
  );
};
