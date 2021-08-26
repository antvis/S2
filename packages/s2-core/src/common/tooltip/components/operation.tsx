import {
  TooltipOperationOptions,
  TooltipOperationState,
} from '@/common/interface';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { find, get, isEqual } from 'lodash';
import React from 'react';
import { HtmlIcon } from '@/common/icons';
import { TOOLTIP_OPERATION_PREFIX_CLS } from '@/common/tooltip/constant';

interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}

const ORDER_OPTIONS: OrderOption[] = [
  { sortMethod: 'ASC', type: 'groupAsc', name: '组内升序' },
  { sortMethod: 'DESC', type: 'groupDesc', name: '组内降序' },
  { sortMethod: null, type: 'none', name: '不排序' },
];

export class TooltipOperation extends React.PureComponent<
  TooltipOperationOptions,
  TooltipOperationState
> {
  state = {
    sortParam: this.props.plot.store.get('sortParam'),
  };

  constructor(props) {
    super(props);
  }

  handleSelectOrder = ({ key: type }) => {
    const { plot, sortFieldId, sortQuery } = this.props;
    // 刷新数据
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
    // 排序条件，存到 store 中
    plot.store.set('sortParam', sortParam);
    if ('setDataCfg' in plot) {
      const dataCfg = { ...plot.dataCfg };
      // 手动排序的优先级高于全局配置
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
    const htmlIconProps = {
      width: 14,
      height: 14,
      style: {
        verticalAlign: 'sub',
        marginRight: 4,
      },
    };
    const menu = (
      <Menu
        selectedKeys={[selectedSortMethod]}
        onClick={this.handleSelectOrder}
      >
        {ORDER_OPTIONS.map((o: OrderOption) => {
          return (
            <Menu.Item className="operation-item" key={o.type}>
              <HtmlIcon type={o.type} {...htmlIconProps} />
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
      <div className={TOOLTIP_OPERATION_PREFIX_CLS}>
        {/* <span className="operation-button">仅显示</span> */}
        {/* <span className="operation-button">排除</span> */}
        {this.getSortSelection()}
        {/* <span className="operation-button"><Icon type="table" /></span> */}
      </div>
    );

    return null;
  }
}
