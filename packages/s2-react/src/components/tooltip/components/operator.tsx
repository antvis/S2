import { Menu, Dropdown, type MenuProps } from 'antd';
import { isEmpty, map } from 'lodash';
import React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import type { TooltipOperatorProps as BaseTooltipOperatorProps } from '@antv/s2-shared';
import type { TooltipOperatorMenu } from '../interface';
import { TooltipIcon } from './icon';

import '@antv/s2-shared/src/styles/tooltip/operator.less';

interface TooltipOperatorProps
  extends BaseTooltipOperatorProps<React.ReactNode, React.ReactNode> {
  onClick?: MenuProps['onClick'];
}

export const TooltipOperator: React.FC<TooltipOperatorProps> = React.memo(
  (props) => {
    const {
      menus,
      onlyShowOperator,
      onClick: onMenuClick,
      cell,
      defaultSelectedKeys,
    } = props;

    const renderTitle = (menu: TooltipOperatorMenu) => (
      <span onClick={() => menu.onClick?.(cell)}>
        <TooltipIcon
          icon={menu.icon!}
          className={`${TOOLTIP_PREFIX_CLS}-operator-icon`}
        />
        <span className={`${TOOLTIP_PREFIX_CLS}-operator-text`}>
          {menu.text}
        </span>
      </span>
    );

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
            {map(children, (subMenu: TooltipOperatorMenu) =>
              renderMenu(subMenu),
            )}
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
      if (onlyShowOperator) {
        return (
          <Menu
            className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
            onClick={onMenuClick}
            defaultSelectedKeys={defaultSelectedKeys}
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
            defaultSelectedKeys={defaultSelectedKeys}
          >
            {map(children, (subMenu: TooltipOperatorMenu) =>
              renderMenu(subMenu),
            )}
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

    if (isEmpty(menus)) {
      return null;
    }

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    );
  },
);
