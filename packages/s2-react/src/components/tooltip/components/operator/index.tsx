import { Menu, Dropdown, MenuProps } from 'antd';
import { isEmpty, map } from 'lodash';
import React from 'react';
import {
  TOOLTIP_PREFIX_CLS,
  TooltipOperatorMenu,
  TooltipOperatorOptions,
  S2CellType,
} from '@antv/s2';
import { Icon } from '../icon';
import './index.less';

interface TooltipOperatorProps extends TooltipOperatorOptions {
  onlyMenu: boolean;
  onClick: MenuProps['onClick'];
  cell: S2CellType;
}

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */

export const TooltipOperator = (props: TooltipOperatorProps) => {
  const { menus, onlyMenu, onClick: onMenuClick, cell } = props;

  const renderTitle = (menu: TooltipOperatorMenu) => {
    return (
      <span onClick={() => menu.onClick?.(cell)}>
        <Icon
          icon={menu.icon}
          className={`${TOOLTIP_PREFIX_CLS}-operator-icon`}
        />
        {menu.text}
      </span>
    );
  };

  const renderMenu = (menu: TooltipOperatorMenu) => {
    const { key, text, children, onClick } = menu;

    if (!isEmpty(children)) {
      return (
        <Menu.SubMenu
          title={renderTitle(menu)}
          key={key}
          popupClassName={`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`}
          onTitleClick={() => onClick?.(cell)}
        >
          {map(children, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item title={text} key={key}>
        {renderTitle(menu)}
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
          {map(menus, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
        </Menu>
      );
    }

    return map(menus, (menu: TooltipOperatorMenu) => {
      const { key, children } = menu;
      const menuRender = !isEmpty(children) ? (
        <Menu
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          onClick={onMenuClick}
          key={key}
        >
          {map(children, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
        </Menu>
      ) : (
        <></>
      );

      return (
        <Dropdown key={key} overlay={menuRender}>
          {renderTitle(menu)}
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
