import { Menu } from 'antd';
import { size, map } from 'lodash';
import * as React from 'react';
import { getIcon, HtmlIcon } from '../../../icons';
import { IMenu, IOperatorProps } from '../../interface';
import { DEFAULT_ICON_PROPS, ICON_CLASS } from '../../constant';

import './index.less';

/**
 * tooltip menu
 *  - UI
 *  - actions
 *    delay 300ms show
 */
export class Operator extends React.PureComponent<IOperatorProps> {
  public onMenuClick = (e) => {
    const { key, domEvent } = e;

    this.props.onClick(key, domEvent);
  };

  public renderIcon(icon): JSX.Element {
    if (getIcon(icon)) {
      return (
        <HtmlIcon className={ICON_CLASS} type={icon} {...DEFAULT_ICON_PROPS} />
      );
    }

    const Component = icon;
    return icon && <Component className={ICON_CLASS} />;
  }

  public renderMenu(menu: IMenu): JSX.Element {
    const { id, icon, text, children } = menu;

    if (size(children)) {
      const subMenuTitle = (
        <span className="submenu-title-wrapper">
          {text}
          {this.renderIcon(icon)}
        </span>
      );

      return (
        <Menu.SubMenu
          title={subMenuTitle}
          key={id}
          popupClassName="eva-tooltip-menu-submenu-popup"
        >
          {map(children, (m: IMenu) => this.renderMenu(m))}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={id}>
        {text}
        {this.renderIcon(icon)}
      </Menu.Item>
    );
  }

  public renderMenus(): JSX.Element {
    const { menus } = this.props;

    return (
      <Menu
        className="tooltip-operator-menus"
        onClick={this.onMenuClick}
        mode="horizontal"
      >
        {map(menus, (menu: IMenu) => this.renderMenu(menu))}
      </Menu>
    );
  }

  public render(): JSX.Element {
    const { menus } = this.props;

    return (
      size(menus) !== 0 && (
        <div className="eva-facet-tooltip-operator">{this.renderMenus()}</div>
      )
    );
  }
}
