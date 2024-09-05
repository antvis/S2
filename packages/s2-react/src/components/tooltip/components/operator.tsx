import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { isEmpty, map } from 'lodash';
import React from 'react';
import type {
  TooltipOperatorMenuInfo,
  TooltipOperatorMenuItem,
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
        items: menus = [],
        onClick,
        selectedKeys,
        render,
        ...otherMenuProps
      },
    } = props;

    if (isEmpty(menus)) {
      return null;
    }

    const onMenuClick = (info: TooltipOperatorMenuInfo) => {
      onClick?.(info, cell);
    };

    const renderMenu = (
      menu: TooltipOperatorMenuItem,
    ): TooltipOperatorMenuItem => {
      const { key, label, children, onClick: onTitleClick } = menu;
      const subMenus = map(
        children,
        renderMenu,
      ) as unknown as TooltipOperatorMenuItem[];

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
        onTitleClick: (info: any) => {
          onTitleClick?.(info, cell);
          onMenuClick?.(info);
        },
        children: subMenus,
      };
    };

    const renderMenus = () => {
      const items = map(menus, renderMenu);

      return render?.({
        mode: onlyShowOperator ? 'vertical' : 'horizontal',
        selectable: onlyShowOperator,
        onClick: onMenuClick,
        items,
        selectedKeys,
        ...otherMenuProps,
      });
    };

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-operator`}>{renderMenus()}</div>
    );
  });

TooltipOperator.displayName = 'TooltipOperator';
