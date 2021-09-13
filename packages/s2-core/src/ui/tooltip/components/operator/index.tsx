import { Menu, Dropdown } from 'antd';
import { isEmpty, map, size } from 'lodash';
import React from 'react';
import { IMenu, TooltipOperatorOptions } from '@/common/interface';
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
  const { menus, onClick, onlyMenu } = props;

  const onMenuClick = (e) => {
    const { key } = e;
    onClick(key, e);
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

  const renderTitle = (text: string, icon) => {
    return (
      <span>
        {renderIcon(icon)}
        {text}
      </span>
    );
  };

  const renderMenu = (menu: IMenu) => {
    const { id, icon, text, children } = menu;

    if (size(children)) {
      return (
        <Menu.SubMenu
          title={renderTitle(text, icon)}
          key={id}
          popupClassName={`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`}
        >
          {map(children, (menu) => renderMenu(menu))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item title={text} key={id}>
        {renderTitle(text, icon)}
      </Menu.Item>
    );
  };

  const renderMenus = () => {
    if (onlyMenu) {
      return (
        <Menu
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          onClick={onMenuClick}
        >
          {map(menus, (menu: IMenu) => renderMenu(menu))}
        </Menu>
      );
    }
    return map(menus, (menu: IMenu) => {
      const { id, icon, text, children } = menu;

      const menuRender = size(children) ? (
        <Menu
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          key={id}
          onClick={onMenuClick}
        >
          {map(children, (menu: IMenu) => renderMenu(menu))}
        </Menu>
      ) : (
        <></>
      );

      return (
        <Dropdown overlay={menuRender}>{renderTitle(text, icon)}</Dropdown>
      );
    });
  };

  return (
    !isEmpty(menus) && (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    )
  );
};