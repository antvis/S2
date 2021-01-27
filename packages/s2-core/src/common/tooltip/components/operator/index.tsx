import { Menu } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { getIcon, HtmlIcon } from '../../../icons';

import './index.less';

const DefaultIconProps = {
  width: 14,
  height: 14,
  style: {
    verticalAlign: 'sub',
    marginRight: 4,
  },
};

export interface IMenu {
  readonly id: string; // 菜单的 id
  readonly icon?: any; // 菜单的 icon
  readonly text?: string; // 菜单的 文本
  readonly children?: IMenu[]; // 二级菜单，TODO 理论上支持无限嵌套，目前仅仅测试了二级菜单
}

export interface IOperatorProps {
  // 点击之后的回调
  readonly onClick: (...params) => void;
  readonly menus: IMenu[];
}

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

  renderIcon = (icon): JSX.Element => {
    const CLS = 'eva-tooltip-operator-icon';

    if (getIcon(icon)) {
      return <HtmlIcon className={CLS} type={icon} {...DefaultIconProps} />;
    }

    const Component = icon;
    return icon ? <Component className={CLS} /> : null;
  };

  public renderMenu(menu: IMenu): JSX.Element {
    const { id, icon, text, children } = menu;

    // 1. 如果存在子菜单，在使用 SubMenu
    if (_.size(children)) {
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
          {_.map(children, (m: IMenu) => this.renderMenu(m))}
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
        {_.map(menus, (menu: IMenu) => this.renderMenu(menu))}
      </Menu>
    );
  }

  public render(): JSX.Element {
    const { menus } = this.props;

    // 没有菜单的时候，就都不显示了！
    if (_.size(menus) === 0) {
      return null;
    }

    return (
      <div className="eva-facet-tooltip-operator">
        {this.renderMenus()}
        {/* <span className="operation-button">仅显示</span> */}
        {/* <span className="operation-button">排除</span> */}
        {/* <span className="operation-button"><Icon type="table" /></span> */}
      </div>
    );
  }
}
