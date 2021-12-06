import { Menu, Dropdown } from 'antd';
import { isEmpty, map, size } from 'lodash';
import React from 'react';
import {
  TOOLTIP_PREFIX_CLS,
  TooltipOperatorMenu,
  TooltipOperatorOptions,
} from '@antv/s2';
import { Icon } from '../icon';
import './index.less';

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */

export const TooltipOperator = (props: TooltipOperatorOptions) => {
  const { menus, onClick, onlyMenu } = props;

  const renderTitle = (text: string, icon: Element | string) => {
    return (
      <span>
        <Icon icon={icon} className={`${TOOLTIP_PREFIX_CLS}-operator-icon`} />
        {text}
      </span>
    );
  };

  const renderMenu = (menu: TooltipOperatorMenu) => {
    const { id, icon, text, children } = menu;

    if (size(children)) {
      return (
        <Menu.SubMenu
          title={renderTitle(text, icon)}
          key={`sub-menu-${id}`}
          popupClassName={`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`}
        >
          {map(children, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
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
          onClick={onClick}
        >
          {map(menus, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
        </Menu>
      );
    }

    return map(menus, (menu: TooltipOperatorMenu) => {
      const { id, icon, text, children } = menu;
      const menuRender = !isEmpty(children) && (
        <Menu
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          onClick={onClick}
          key={id}
        >
          {map(children, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
        </Menu>
      );

      return (
        <Dropdown overlay={menuRender} {...(!size(children) && { onClick })}>
          {renderTitle(text, icon)}
        </Dropdown>
      );
    });
  };

  return (
    !isEmpty(menus) && (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    )
  );
};
