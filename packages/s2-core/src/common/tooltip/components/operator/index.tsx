import { Menu } from 'antd';
import { size, map } from 'lodash';
import * as React from 'react';
import { getIcon, HtmlIcon } from '../../../icons';
import { IMenu, IOperatorProps } from '../../interface';
import { DEFAULT_ICON_PROPS, ICON_CLASS } from '../../constant';

import './index.less';

/**
 * tooltip 的菜单栏！
 *  - UI
 * 1. 传入配置（id、名称、icon、onClick）
 * 2. 延迟显示逻辑
 * 3. 双层按钮，单层按钮，icon，文本按钮（目前不需要记录状态）
 *  - 动作
 * 1. 延迟 300ms 显示的能力
 */
export class Operator extends React.PureComponent<IOperatorProps> {
  /**
   * 惨淡点击的回调
   */
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

    // 1. 如果存在子菜单，在使用 SubMenu
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

    // 2. 如果不包含子菜单，那么直接使用 Menu 渲染
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
