import { Menu, Dropdown } from 'antd';
import { isEmpty, map, size } from 'lodash';
import React from 'react';
import { Icon } from '../icon';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';
import {
  TooltipOperatorMenu,
  TooltipOperatorOptions,
} from '@/common/interface';
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

  const renderTitle = (text: string, icon: React.ReactNode) => {
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
          key={id}
          popupClassName={`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`}
        >
          {map(children, (subMenu) => renderMenu(subMenu))}
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
          {map(menus, (menu: TooltipOperatorMenu) => renderMenu(menu))}
        </Menu>
      );
    }
    return map(menus, (menu: TooltipOperatorMenu) => {
      const { id, icon, text, children } = menu;

      const menuRender = size(children) ? (
        <Menu
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          key={id}
          onClick={onMenuClick}
        >
          {map(children, (subMenu: TooltipOperatorMenu) => renderMenu(subMenu))}
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
