import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import type { TooltipOperatorProps as BaseTooltipOperatorProps } from '@antv/s2-shared';
import { Menu, type MenuProps } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { isEmpty, map } from 'lodash';
import React from 'react';
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

    if (isEmpty(menus)) {
      return null;
    }

    const renderMenu = (menu: TooltipOperatorMenu): ItemType => {
      const { key, label, children, onClick } = menu;
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
          onClick?.(cell);
          onMenuClick?.(info as any);
        },
        children: subMenus,
      };
    };

    const renderMenus = () => {
      const items = map(menus, renderMenu) as unknown as ItemType[];

      // TODO: 透传 antd menu 参数
      return (
        <Menu
          mode={onlyShowOperator ? 'vertical' : 'horizontal'}
          className={`${TOOLTIP_PREFIX_CLS}-operator-menus`}
          onClick={(...args) => {
            onMenuClick?.(...args);
          }}
          defaultSelectedKeys={defaultSelectedKeys}
          items={items}
          selectable={onlyShowOperator}
        />
      );
    };

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    );
  },
);
