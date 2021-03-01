import { Menu } from 'antd';
import { size, map } from 'lodash';
import * as React from 'react';
import { getIcon, HtmlIcon } from '../../../icons';
import { IMenu, OperatorProps } from '../../interface';
import { TOOLTIP_CLASS_PRE, DEFAULT_ICON_PROPS } from '../../constant';

import './index.less';

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */

const Operator = (props: OperatorProps) => {
  const { menus, onClick } = props;

  const onMenuClick = (e) => {
    const { key, domEvent } = e;

    onClick(key, domEvent);
  };

  const renderIcon = (icon) => {
    if (getIcon(icon)) {
      return (
        <HtmlIcon
          className={`${TOOLTIP_CLASS_PRE}-operator-icon`}
          type={icon}
          {...DEFAULT_ICON_PROPS}
        />
      );
    }

    const Component = icon;
    return (
      icon && <Component className={`${TOOLTIP_CLASS_PRE}-operator-icon`} />
    );
  };

  const renderMenu = (menu: IMenu) => {
    const { id, icon, text, children } = menu;

    if (size(children)) {
      const subMenuTitle = (
        <span>
          {text}
          {renderIcon(icon)}
        </span>
      );

      return (
        <Menu.SubMenu
          title={subMenuTitle}
          key={id}
          popupClassName={`${TOOLTIP_CLASS_PRE}-operator-submenu-popup`}
        >
          {map(children, (m: IMenu) => renderMenu(m))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={id}>
        {text}
        {renderIcon(icon)}
      </Menu.Item>
    );
  };

  const renderMenus = () => {
    return (
      <Menu
        className={`${TOOLTIP_CLASS_PRE}-operator-menus`}
        id={`${TOOLTIP_CLASS_PRE}-operator-menus`}
        onClick={onMenuClick}
        mode="horizontal"
      >
        {map(menus, (menu: IMenu) => renderMenu(menu))}
      </Menu>
    );
  };

  return (
    size(menus) !== 0 && (
      <div className={`${TOOLTIP_CLASS_PRE}-operator`}>{renderMenus()}</div>
    )
  );
};

export default Operator;
