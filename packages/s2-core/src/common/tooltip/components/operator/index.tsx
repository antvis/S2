import { IMenu, TooltipOperatorOptions } from '@/common/interface';
import { Menu } from 'antd';
import { isEmpty, map, size } from 'lodash';
import React from 'react';
import { getIcon, HtmlIcon } from '../../../icons';
import { DEFAULT_ICON_PROPS, TOOLTIP_CLASS_PRE } from '../../constant';
import './index.less';

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */

const Operator = (props: TooltipOperatorOptions) => {
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
    !isEmpty(menus) && (
      <div className={`${TOOLTIP_CLASS_PRE}-operator`}>{renderMenus()}</div>
    )
  );
};

export default Operator;
