import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { Menu } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import cls from 'classnames';
import { isEmpty, map } from 'lodash';
import React from 'react';
import type {
  TooltipOperatorMenuItem,
  TooltipOperatorMenuInfo,
  TooltipOperatorProps,
} from '../interface';
import { TooltipIcon } from './icon';

import '@antv/s2-shared/src/styles/tooltip/operator.less';

export const TooltipOperator: React.FC<Required<TooltipOperatorProps>> =
  React.memo((props) => {
    const {
      onlyShowOperator,
      cell,
      menu: {
        className,
        items: menus,
        onClick,
        defaultSelectedKeys,
        ...otherMenuProps
      },
    } = props;

    if (isEmpty(menus)) {
      return null;
    }

    const onMenuClick = (info: TooltipOperatorMenuInfo) => {
      onClick?.(info, cell);
    };

    const renderMenu = (menu: TooltipOperatorMenuItem): ItemType => {
      const { key, label, children, onClick: onTitleClick } = menu;
      const subMenus = map(children, renderMenu) as unknown as ItemType[];

      return {
        key,
        label,
        icon: (
          <TooltipIcon
            icon={menu.icon!}
            className={`${TOOLTIP_PREFIX_CLS}-operator-icon`}
          />
        ),
        popupClassName: `${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`,
        onTitleClick: (info) => {
          onTitleClick?.(info as any, cell);
          onMenuClick?.(info);
        },
        children: subMenus,
      };
    };

    const renderMenus = () => {
      const items = map(menus, renderMenu) as unknown as ItemType[];

      return (
        <Menu
          mode={onlyShowOperator ? 'vertical' : 'horizontal'}
          className={cls(`${TOOLTIP_PREFIX_CLS}-operator-menus`, className)}
          onClick={onMenuClick}
          defaultSelectedKeys={defaultSelectedKeys}
          items={items}
          selectable={onlyShowOperator}
          {...otherMenuProps}
        />
      );
    };

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    );
  });

TooltipOperator.displayName = 'TooltipOperator';
TooltipOperator.defaultProps = {
  menu: {
    items: [],
  },
};
