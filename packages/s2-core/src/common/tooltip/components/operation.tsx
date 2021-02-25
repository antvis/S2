import { find, get, isEqual } from 'lodash';
import * as React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { HtmlIcon } from '../../icons';
import { OperationProps, OperationState, OrderOption } from '../interface';
import {
  OPERATION_CONTAINER_CLASS,
  ORDER_OPTIONS,
  DEFAULT_ICON_PROPS,
} from '../constant';

export class TooltipOperation extends React.PureComponent<
  OperationProps,
  OperationState
> {
  state = {
    sortParam: this.props.plot?.store?.get('sortParam'),
  };

  constructor(props) {
    super(props);
  }

  handleSelectOrder = ({ key: type }) => {
    const { plot, sortFieldId, sortQuery } = this.props;
    // refresh data
    const selectedOption = find(ORDER_OPTIONS, { type }) as OrderOption;
    const sortParam =
      type === 'none'
        ? null
        : {
            type,
            sortFieldId,
            sortMethod: get(selectedOption, 'sortMethod'),
            query: sortQuery,
          };
    // sort condition, save to store
    plot.store.set('sortParam', sortParam);
    if ('setDataCfg' in plot) {
      const dataCfg = { ...plot.dataCfg };
      // priority of manual sorting is higher than global configuration
      dataCfg.sortParams = [].concat(sortParam || [], dataCfg.sortParams);
      // 声控编程 by lqs
      // 内部更新排序规则，直接使用dataset方法
      plot.dataSet.setDataCfg(dataCfg);
      // 手动重新渲染，不触发plot的setDataCfg流程
      plot.render(false);

      this.setState({ sortParam });
    }
  };

  getSortSelection = () => {
    const { sortQuery } = this.props;
    const sortParam = this.state.sortParam;
    let selectedSortMethod = null;
    if (sortParam && isEqual(get(sortParam, 'query'), sortQuery)) {
      selectedSortMethod = get(sortParam, 'sortMethod', null);
    }
    const selectedSortOption = find(ORDER_OPTIONS, {
      sortMethod: selectedSortMethod,
    });
    const selectedSortName = get(selectedSortOption, 'name');
    const menu = (
      <Menu
        selectedKeys={[selectedSortMethod]}
        onClick={this.handleSelectOrder}
      >
        {ORDER_OPTIONS.map((o: OrderOption) => {
          return (
            <Menu.Item className="operation-item" key={o.type}>
              <HtmlIcon type={o.type} {...DEFAULT_ICON_PROPS} />
              {o.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className="operation-button">
          {selectedSortName} <DownOutlined type="down" />
        </span>
      </Dropdown>
    );
  };

  render(): JSX.Element {
    return (
      <div className={OPERATION_CONTAINER_CLASS}>{this.getSortSelection()}</div>
    );

    return null;
  }
}
